-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('job', 'internship');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "type" "JobType" NOT NULL DEFAULT 'job';
