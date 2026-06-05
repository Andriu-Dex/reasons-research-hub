-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('UPDATE', 'EVENT', 'AGREEMENT');

-- DropIndex
DROP INDEX "news_organization_id_status_display_order_published_at_idx";

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "news_category" "NewsCategory" NOT NULL DEFAULT 'UPDATE';

-- CreateIndex
CREATE INDEX "news_organization_id_status_news_category_display_order_pub_idx" ON "news"("organization_id", "status", "news_category", "display_order", "published_at");
