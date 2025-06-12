-- AlterTable
ALTER TABLE "alumni" ADD COLUMN     "company_role" VARCHAR(100);

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "batch_end_year" INTEGER,
ADD COLUMN     "batch_start_year" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "github_url" VARCHAR(500),
ADD COLUMN     "twitter_url" VARCHAR(500);
