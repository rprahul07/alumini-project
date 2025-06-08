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
    IF OLD.password IS DISTINCT FROM NEW.password THEN
        INSERT INTO password_change_history (user_id, user_type)
        VALUES (NEW.id, NEW.role);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Email Change Tracking Function
CREATE OR REPLACE FUNCTION track_email_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.email IS DISTINCT FROM NEW.email THEN
        INSERT INTO email_change_history (user_id, user_type, old_email, new_email)
        VALUES (NEW.id, NEW.role, OLD.email, NEW.email);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger for Password Change
CREATE TRIGGER track_user_password
AFTER UPDATE ON users
FOR EACH ROW
WHEN (OLD.password IS DISTINCT FROM NEW.password)
EXECUTE FUNCTION track_password_changes();

-- Create Trigger for Email Change
CREATE TRIGGER track_user_email
BEFORE UPDATE ON users
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION track_email_changes();
