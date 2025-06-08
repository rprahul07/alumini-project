-- Alumni Validation
CREATE OR REPLACE FUNCTION validate_alumni_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.graduation_year > EXTRACT(YEAR FROM CURRENT_TIMESTAMP) THEN
        RAISE EXCEPTION 'Graduation year cannot be in the future';
    END IF;

    IF NEW.graduation_year < 1950 THEN
        RAISE EXCEPTION 'Invalid graduation year';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Student Validation
CREATE OR REPLACE FUNCTION validate_student_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_semester::INTEGER < 1 OR NEW.current_semester::INTEGER > 8 THEN
        RAISE EXCEPTION 'Current semester must be between 1 and 8';
    END IF;

    IF NOT NEW.roll_number ~ '^[A-Z0-9]+$' THEN
        RAISE EXCEPTION 'Invalid roll number format';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Faculty Validation
CREATE OR REPLACE FUNCTION validate_faculty_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.designation NOT IN ('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer') THEN
        RAISE EXCEPTION 'Invalid faculty designation';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Common Validation (only on `users`)
CREATE OR REPLACE FUNCTION validate_common_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;

    IF NEW.phone_number !~ '^\+?[0-9]{10,15}$' THEN
        RAISE EXCEPTION 'Invalid phone number format';
    END IF;

    IF NEW.department NOT IN ('Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical') THEN
        RAISE EXCEPTION 'Invalid department';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



-- Role-specific triggers (still needed)
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

-- Common trigger only on `users`
CREATE TRIGGER validate_user_common
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION validate_common_data();
