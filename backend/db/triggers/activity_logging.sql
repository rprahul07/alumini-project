-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_type VARCHAR(10),
    action VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logging Function
CREATE OR REPLACE FUNCTION log_account_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (user_id, user_type, action, details)
    VALUES (
        NEW.id,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'ACCOUNT_CREATED'
            WHEN TG_OP = 'UPDATE' THEN 'ACCOUNT_UPDATED'
            WHEN TG_OP = 'DELETE' THEN 'ACCOUNT_DELETED'
            ELSE TG_OP
        END,
        jsonb_build_object(
            'email', NEW.email,
            'department', NEW.department,
            'timestamp', CURRENT_TIMESTAMP,
            'changes', CASE 
                WHEN TG_OP = 'UPDATE' THEN jsonb_build_object(
                    'old', row_to_json(OLD),
                    'new', row_to_json(NEW)
                )
                ELSE NULL
            END
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Activity Logging Triggers for Each Table
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