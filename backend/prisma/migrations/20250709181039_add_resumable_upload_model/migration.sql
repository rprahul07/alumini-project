-- DropIndex
DROP INDEX "jobs_status_idx";

-- DropIndex
DROP INDEX "jobs_user_id_idx";

-- CreateTable
CREATE TABLE "resumable_uploads" (
    "fileId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "totalChunks" INTEGER NOT NULL,
    "uploadedBlocks" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumable_uploads_pkey" PRIMARY KEY ("fileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "resumable_uploads_fileId_key" ON "resumable_uploads"("fileId");
