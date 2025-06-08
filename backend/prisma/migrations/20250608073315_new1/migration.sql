/*
  Warnings:

  - Changed the type of `current_semester` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "students" DROP COLUMN "current_semester",
ADD COLUMN     "current_semester" INTEGER NOT NULL;
