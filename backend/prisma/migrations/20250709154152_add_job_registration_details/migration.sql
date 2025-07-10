/*
  Warnings:

  - You are about to drop the column `currentJobTitle` on the `JobRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `highestQualification` on the `JobRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `totalExperience` on the `JobRegistration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobRegistration" DROP COLUMN "currentJobTitle",
DROP COLUMN "highestQualification",
DROP COLUMN "totalExperience";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currentJobTitle" TEXT,
ADD COLUMN     "highestQualification" TEXT,
ADD COLUMN     "totalExperience" INTEGER;
