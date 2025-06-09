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
