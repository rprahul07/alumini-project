-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_verified" VARCHAR(50) NOT NULL DEFAULT 'Pending';
