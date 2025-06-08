/*
  Warnings:

  - You are about to drop the column `created_at` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `alumni` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `user_type` on the `activity_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `alumni` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `user_type` on the `email_change_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `faculty` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `user_type` on the `password_change_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ALUMNI', 'FACULTY', 'ADMIN');

-- DropIndex
DROP INDEX "admins_email_idx";

-- DropIndex
DROP INDEX "admins_email_key";

-- DropIndex
DROP INDEX "alumni_email_idx";

-- DropIndex
DROP INDEX "alumni_email_key";

-- DropIndex
DROP INDEX "faculty_email_idx";

-- DropIndex
DROP INDEX "faculty_email_key";

-- DropIndex
DROP INDEX "students_email_idx";

-- DropIndex
DROP INDEX "students_email_key";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "user_type",
ADD COLUMN     "user_type" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "full_name",
DROP COLUMN "password",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "alumni" DROP COLUMN "created_at",
DROP COLUMN "department",
DROP COLUMN "email",
DROP COLUMN "full_name",
DROP COLUMN "password",
DROP COLUMN "phone_number",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "email_change_logs" DROP COLUMN "user_type",
ADD COLUMN     "user_type" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "faculty" DROP COLUMN "created_at",
DROP COLUMN "department",
DROP COLUMN "email",
DROP COLUMN "full_name",
DROP COLUMN "password",
DROP COLUMN "phone_number",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "password_change_logs" DROP COLUMN "user_type",
ADD COLUMN     "user_type" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "created_at",
DROP COLUMN "department",
DROP COLUMN "email",
DROP COLUMN "full_name",
DROP COLUMN "password",
DROP COLUMN "phone_number",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20),
    "department" VARCHAR(100),
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_user_id_key" ON "alumni"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_user_id_key" ON "faculty"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
