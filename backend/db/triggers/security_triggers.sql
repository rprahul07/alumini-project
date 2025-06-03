-- Password Change History Table
CREATE TABLE IF NOT EXISTS password_change_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_type VARCHAR(10),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Change History Table
CREATE TABLE IF NOT EXISTS email_change_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_type VARCHAR(10),
    old_email VARCHAR(100),
    new_email VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password Change Tracking Function
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

-- Email Change Tracking Function
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

-- Create Password Change Triggers
CREATE TRIGGER track_student_password
AFTER UPDATE ON students
FOR EACH ROW
WHEN (OLD.password IS DISTINCT FROM NEW.password)
EXECUTE FUNCTION track_password_changes();

CREATE TRIGGER track_alumni_password
AFTER UPDATE ON alumni
FOR EACH ROW
WHEN (OLD.password IS DISTINCT FROM NEW.password)
EXECUTE FUNCTION track_password_changes();

CREATE TRIGGER track_faculty_password
AFTER UPDATE ON faculty
FOR EACH ROW
WHEN (OLD.password IS DISTINCT FROM NEW.password)
EXECUTE FUNCTION track_password_changes();

-- Create Email Change Triggers
CREATE TRIGGER track_student_email
BEFORE UPDATE ON students
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION track_email_changes();

CREATE TRIGGER track_alumni_email
BEFORE UPDATE ON alumni
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION track_email_changes();

CREATE TRIGGER track_faculty_email
BEFORE UPDATE ON faculty
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION track_email_changes(); 