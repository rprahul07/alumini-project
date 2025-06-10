/*
  Warnings:

  - You are about to drop the `alumni_work_experience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "alumni_work_experience" DROP CONSTRAINT "alumni_work_experience_alumni_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "work_experience" JSONB;

-- DropTable
DROP TABLE "alumni_work_experience";

-- CreateIndex
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "email_change_logs_user_id_idx" ON "email_change_logs"("user_id");

-- CreateIndex
CREATE INDEX "password_change_logs_user_id_idx" ON "password_change_logs"("user_id");
