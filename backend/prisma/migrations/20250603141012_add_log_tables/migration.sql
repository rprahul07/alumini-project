-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_type" VARCHAR(50) NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_change_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_type" VARCHAR(50) NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_change_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_type" VARCHAR(50) NOT NULL,
    "old_email" VARCHAR(100) NOT NULL,
    "new_email" VARCHAR(100) NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_change_logs_pkey" PRIMARY KEY ("id")
);

-- Create Activity Logging Function
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

-- Create Activity Logging Triggers
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

-- CreateIndex
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "password_change_logs_user_id_idx" ON "password_change_logs"("user_id");

-- CreateIndex
CREATE INDEX "email_change_logs_user_id_idx" ON "email_change_logs"("user_id");
