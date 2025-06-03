-- Create activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_type VARCHAR(10),
    action VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create email change history table
CREATE TABLE IF NOT EXISTS email_change_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_type VARCHAR(10),
    old_email VARCHAR(100),
    new_email VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create password change history table
CREATE TABLE IF NOT EXISTS password_change_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_type VARCHAR(10),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add last_login column to existing tables
ALTER TABLE students ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE alumni ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_login = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
            ELSE TG_OP
        END,
        jsonb_build_object(
            'email', NEW.email,
            'department', NEW.department,
            'timestamp', CURRENT_TIMESTAMP
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION track_email_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.email <> NEW.email THEN
        INSERT INTO email_change_history (user_id, user_type, old_email, new_email)
        VALUES (NEW.id, TG_TABLE_NAME, OLD.email, NEW.email);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_alumni_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.graduation_year > EXTRACT(YEAR FROM CURRENT_DATE) THEN
        RAISE EXCEPTION 'Graduation year cannot be in the future';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION track_password_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.password <> NEW.password THEN
        INSERT INTO password_change_history (user_id, user_type)
        VALUES (NEW.id, TG_TABLE_NAME);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for students
DROP TRIGGER IF EXISTS track_last_login_student ON students;
CREATE TRIGGER track_last_login_student
BEFORE UPDATE ON students
FOR EACH ROW
WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
EXECUTE FUNCTION update_last_login();

DROP TRIGGER IF EXISTS log_student_activity ON students;
CREATE TRIGGER log_student_activity
AFTER INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION log_account_activity();

DROP TRIGGER IF EXISTS track_student_email ON students;
CREATE TRIGGER track_student_email
BEFORE UPDATE ON students
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION track_email_changes();

DROP TRIGGER IF EXISTS track_student_password ON students;
CREATE TRIGGER track_student_password
AFTER UPDATE ON students
FOR EACH ROW
WHEN (OLD.password IS DISTINCT FROM NEW.password)
EXECUTE FUNCTION track_password_changes();

-- Create triggers for alumni
DROP TRIGGER IF EXISTS track_last_login_alumni ON alumni;
CREATE TRIGGER track_last_login_alumni
BEFORE UPDATE ON alumni
FOR EACH ROW
WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
EXECUTE FUNCTION update_last_login();

DROP TRIGGER IF EXISTS log_alumni_activity ON alumni;
CREATE TRIGGER log_alumni_activity
AFTER INSERT OR UPDATE ON alumni
FOR EACH ROW
EXECUTE FUNCTION log_account_activity();

DROP TRIGGER IF EXISTS track_alumni_email ON alumni;
CREATE TRIGGER track_alumni_email
BEFORE UPDATE ON alumni
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION track_email_changes();

DROP TRIGGER IF EXISTS validate_alumni ON alumni;
CREATE TRIGGER validate_alumni
BEFORE INSERT OR UPDATE ON alumni
FOR EACH ROW
EXECUTE FUNCTION validate_alumni_data();

DROP TRIGGER IF EXISTS track_alumni_password ON alumni;
CREATE TRIGGER track_alumni_password
AFTER UPDATE ON alumni
FOR EACH ROW
WHEN (OLD.password IS DISTINCT FROM NEW.password)
EXECUTE FUNCTION track_password_changes();

-- Create triggers for faculty
DROP TRIGGER IF EXISTS track_last_login_faculty ON faculty;
CREATE TRIGGER track_last_login_faculty
BEFORE UPDATE ON faculty
FOR EACH ROW
WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
EXECUTE FUNCTION update_last_login();

DROP TRIGGER IF EXISTS log_faculty_activity ON faculty;
CREATE TRIGGER log_faculty_activity
AFTER INSERT OR UPDATE ON faculty
FOR EACH ROW
EXECUTE FUNCTION log_account_activity();

DROP TRIGGER IF EXISTS track_faculty_email ON faculty;
CREATE TRIGGER track_faculty_email
BEFORE UPDATE ON faculty
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION track_email_changes();

DROP TRIGGER IF EXISTS track_faculty_password ON faculty;
CREATE TRIGGER track_faculty_password
AFTER UPDATE ON faculty
FOR EACH ROW
WHEN (OLD.password IS DISTINCT FROM NEW.password)
EXECUTE FUNCTION track_password_changes(); 