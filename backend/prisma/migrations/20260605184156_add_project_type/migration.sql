-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('ACADEMIC', 'RESEARCH');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "project_type" "ProjectType" NOT NULL DEFAULT 'RESEARCH';
