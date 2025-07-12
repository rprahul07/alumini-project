-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resume_url" VARCHAR(500),
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];
