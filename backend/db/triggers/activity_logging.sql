-- ==============================
-- Activity Logs Table
-- ==============================
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_type VARCHAR(10),  -- Role: STUDENT, ALUMNI, etc.
    action VARCHAR(50),     -- Action: ACCOUNT_CREATED, etc.
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- Log User (Generic) Activity
-- ==============================
CREATE OR REPLACE FUNCTION log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (user_id, user_type, action, details)
    VALUES (
        COALESCE(NEW.id, OLD.id),
        COALESCE(NEW.role::TEXT, OLD.role::TEXT),
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'ACCOUNT_CREATED'
            WHEN TG_OP = 'UPDATE' THEN 'ACCOUNT_UPDATED'
            WHEN TG_OP = 'DELETE' THEN 'ACCOUNT_DELETED'
            ELSE TG_OP
        END,
        jsonb_build_object(
            'email', COALESCE(NEW.email, OLD.email),
            'department', COALESCE(NEW.department, OLD.department),
            'timestamp', CURRENT_TIMESTAMP,
            'changes', CASE 
                WHEN TG_OP = 'UPDATE' THEN jsonb_build_object(
                    'old_data', row_to_json(OLD),  -- Changed from 'old'
                    'new_data', row_to_json(NEW)   -- Changed from 'new'
                )
                ELSE NULL
            END
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger on users table (main user-level actions)
CREATE TRIGGER log_user_activity_trigger
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION log_user_activity();

-- ==============================
-- Log Role-Specific Details
-- ==============================

-- Keep the old function for role-specific changes (students, alumni, faculty)
-- Fixed trigger with correct case-sensitive "Role" type
CREATE OR REPLACE FUNCTION log_account_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (user_id, user_type, action, details)
    VALUES (
        COALESCE(NEW.user_id, OLD.user_id),
        CASE TG_TABLE_NAME
            WHEN 'students' THEN 'student'::"Role"
            WHEN 'alumni' THEN 'alumni'::"Role"
            WHEN 'faculty' THEN 'faculty'::"Role"
            ELSE 'student'::"Role"  -- default fallback
        END,
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'DETAILS_CREATED'
            WHEN TG_OP = 'UPDATE' THEN 'DETAILS_UPDATED'
            WHEN TG_OP = 'DELETE' THEN 'DETAILS_DELETED'
            ELSE TG_OP
        END,
        jsonb_build_object(
            'timestamp', CURRENT_TIMESTAMP,
            'operation', TG_OP,
            'table_name', TG_TABLE_NAME
        )
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers on role-specific detail tables
CREATE TRIGGER log_student_activity
AFTER INSERT OR UPDATE OR DELETE ON students
FOR EACH ROW
EXECUTE FUNCTION log_account_activity();

CREATE TRIGGER log_alumni_activity
AFTER INSERT OR UPDATE OR DELETE ON alumni
FOR EACH ROW
EXECUTE FUNCTION log_account_activity();

CREATE TRIGGER log_faculty_activity
AFTER INSERT OR UPDATE OR DELETE ON faculty
FOR EACH ROW
EXECUTE FUNCTION log_account_activity();
