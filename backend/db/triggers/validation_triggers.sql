-- Alumni Data Validation Function
CREATE OR REPLACE FUNCTION validate_alumni_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure graduation_year is not in future
    IF NEW.graduation_year > EXTRACT(YEAR FROM CURRENT_TIMESTAMP) THEN
        RAISE EXCEPTION 'Graduation year cannot be in the future';
    END IF;

    -- Ensure graduation_year is not too old (e.g., not before 1950)
    IF NEW.graduation_year < 1950 THEN
        RAISE EXCEPTION 'Invalid graduation year';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Student Data Validation Function
CREATE OR REPLACE FUNCTION validate_student_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate current semester (assuming 8 semesters max)
    IF NEW.current_semester::integer < 1 OR NEW.current_semester::integer > 8 THEN
        RAISE EXCEPTION 'Current semester must be between 1 and 8';
    END IF;

    -- Validate roll number format (can be customized based on your format)
    IF NOT NEW.roll_number ~ '^[A-Z0-9]+$' THEN
        RAISE EXCEPTION 'Invalid roll number format';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Faculty Data Validation Function
CREATE OR REPLACE FUNCTION validate_faculty_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate designation (example list - modify as needed)
    IF NEW.designation NOT IN ('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer') THEN
        RAISE EXCEPTION 'Invalid faculty designation';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Common Data Validation Function
CREATE OR REPLACE FUNCTION validate_common_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate email format
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;

    -- Validate phone number (basic format)
    IF NEW.phone_number !~ '^\+?[0-9]{10,15}$' THEN
        RAISE EXCEPTION 'Invalid phone number format';
    END IF;

    -- Validate department (example list - modify as needed)
    IF NEW.department NOT IN ('Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical') THEN
        RAISE EXCEPTION 'Invalid department';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Validation Triggers
CREATE TRIGGER validate_alumni
BEFORE INSERT OR UPDATE ON alumni
FOR EACH ROW
EXECUTE FUNCTION validate_alumni_data();

CREATE TRIGGER validate_student
BEFORE INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION validate_student_data();

CREATE TRIGGER validate_faculty
BEFORE INSERT OR UPDATE ON faculty
FOR EACH ROW
EXECUTE FUNCTION validate_faculty_data();

-- Add Common Validation Triggers
CREATE TRIGGER validate_student_common
BEFORE INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION validate_common_data();

CREATE TRIGGER validate_alumni_common
BEFORE INSERT OR UPDATE ON alumni
FOR EACH ROW
EXECUTE FUNCTION validate_common_data();

CREATE TRIGGER validate_faculty_common
BEFORE INSERT OR UPDATE ON faculty
FOR EACH ROW
EXECUTE FUNCTION validate_common_data(); 