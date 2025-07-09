-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('internal', 'external');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "get_email_notification" BOOLEAN,
ADD COLUMN     "registration_link" VARCHAR(500),
ADD COLUMN     "registration_type" "RegistrationType" NOT NULL DEFAULT 'internal';

-- CreateTable
CREATE TABLE "job_registrations" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_registrations_job_id_idx" ON "job_registrations"("job_id");

-- CreateIndex
CREATE INDEX "job_registrations_user_id_idx" ON "job_registrations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_registrations_job_id_user_id_key" ON "job_registrations"("job_id", "user_id");

-- AddForeignKey
ALTER TABLE "job_registrations" ADD CONSTRAINT "job_registrations_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_registrations" ADD CONSTRAINT "job_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
