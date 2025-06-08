/*
  Warnings:

  - The values [STUDENT,ALUMNI,FACULTY,ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('student', 'alumni', 'faculty', 'admin');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "activity_logs" ALTER COLUMN "user_type" TYPE "Role_new" USING ("user_type"::text::"Role_new");
ALTER TABLE "password_change_logs" ALTER COLUMN "user_type" TYPE "Role_new" USING ("user_type"::text::"Role_new");
ALTER TABLE "email_change_logs" ALTER COLUMN "user_type" TYPE "Role_new" USING ("user_type"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;
