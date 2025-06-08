-- ==============================
-- Drop Role-Specific Triggers
-- ==============================
DROP TRIGGER IF EXISTS log_student_activity ON students;
DROP TRIGGER IF EXISTS log_alumni_activity ON alumni;
DROP TRIGGER IF EXISTS log_faculty_activity ON faculty;

DROP TRIGGER IF EXISTS track_student_password ON students;
DROP TRIGGER IF EXISTS track_alumni_password ON alumni;
DROP TRIGGER IF EXISTS track_faculty_password ON faculty;

DROP TRIGGER IF EXISTS track_student_email ON students;
DROP TRIGGER IF EXISTS track_alumni_email ON alumni;
DROP TRIGGER IF EXISTS track_faculty_email ON faculty;

DROP TRIGGER IF EXISTS validate_alumni ON alumni;
DROP TRIGGER IF EXISTS validate_student ON students;
DROP TRIGGER IF EXISTS validate_faculty ON faculty;

DROP TRIGGER IF EXISTS validate_student_common ON students;
DROP TRIGGER IF EXISTS validate_alumni_common ON alumni;
DROP TRIGGER IF EXISTS validate_faculty_common ON faculty;

-- ==============================
-- Drop New Unified Triggers
-- ==============================
DROP TRIGGER IF EXISTS log_user_activity_trigger ON users;

-- ==============================
-- Drop All Functions
-- ==============================
DROP FUNCTION IF EXISTS log_account_activity();
DROP FUNCTION IF EXISTS log_user_activity();
DROP FUNCTION IF EXISTS track_password_changes();
DROP FUNCTION IF EXISTS track_email_changes();
DROP FUNCTION IF EXISTS validate_alumni_data();
DROP FUNCTION IF EXISTS validate_student_data();
DROP FUNCTION IF EXISTS validate_faculty_data();
DROP FUNCTION IF EXISTS validate_common_data();

-- ==============================
-- Drop History Tables
-- ==============================
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS password_change_history;
DROP TABLE IF EXISTS email_change_history;
