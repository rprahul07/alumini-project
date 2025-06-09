-- AlterTable
ALTER TABLE "students" ADD COLUMN     "graduation_year" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "linkedin_url" VARCHAR(500);

-- CreateTable
CREATE TABLE "alumni_work_experience" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "alumni_id" INTEGER NOT NULL,

    CONSTRAINT "alumni_work_experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "alumni_work_experience_alumni_id_idx" ON "alumni_work_experience"("alumni_id");

-- AddForeignKey
ALTER TABLE "alumni_work_experience" ADD CONSTRAINT "alumni_work_experience_alumni_id_fkey" FOREIGN KEY ("alumni_id") REFERENCES "alumni"("id") ON DELETE CASCADE ON UPDATE CASCADE;
