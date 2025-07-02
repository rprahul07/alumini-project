-- CreateTable
CREATE TABLE "support_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "alumni_id" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "support_requests_user_id_idx" ON "support_requests"("user_id");

-- CreateIndex
CREATE INDEX "support_requests_alumni_id_idx" ON "support_requests"("alumni_id");
