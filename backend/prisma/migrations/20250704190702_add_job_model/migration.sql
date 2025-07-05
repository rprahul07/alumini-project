-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('pending', 'approved', 'rejected', 'closed');

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "companyName" VARCHAR(200) NOT NULL,
    "jobTitle" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_user_id_idx" ON "jobs"("user_id");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
