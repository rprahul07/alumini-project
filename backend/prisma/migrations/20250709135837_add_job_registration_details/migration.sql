/*
  Warnings:

  - You are about to drop the `job_registrations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "job_registrations" DROP CONSTRAINT "job_registrations_job_id_fkey";

-- DropForeignKey
ALTER TABLE "job_registrations" DROP CONSTRAINT "job_registrations_user_id_fkey";

-- DropTable
DROP TABLE "job_registrations";

-- CreateTable
CREATE TABLE "JobRegistration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "highestQualification" TEXT NOT NULL,
    "passoutYear" INTEGER NOT NULL,
    "degreeSpecialization" TEXT NOT NULL,
    "currentJobTitle" TEXT NOT NULL,
    "totalExperience" INTEGER NOT NULL,
    "linkedInProfile" TEXT,

    CONSTRAINT "JobRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobRegistration_jobId_userId_key" ON "JobRegistration"("jobId", "userId");

-- AddForeignKey
ALTER TABLE "JobRegistration" ADD CONSTRAINT "JobRegistration_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRegistration" ADD CONSTRAINT "JobRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
