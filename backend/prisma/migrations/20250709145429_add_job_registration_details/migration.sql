/*
  Warnings:

  - You are about to drop the column `degreeSpecialization` on the `JobRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `JobRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `linkedInProfile` on the `JobRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `JobRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `passoutYear` on the `JobRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `JobRegistration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobRegistration" DROP COLUMN "degreeSpecialization",
DROP COLUMN "email",
DROP COLUMN "linkedInProfile",
DROP COLUMN "name",
DROP COLUMN "passoutYear",
DROP COLUMN "phoneNumber",
ALTER COLUMN "currentJobTitle" DROP NOT NULL,
ALTER COLUMN "totalExperience" DROP NOT NULL;
