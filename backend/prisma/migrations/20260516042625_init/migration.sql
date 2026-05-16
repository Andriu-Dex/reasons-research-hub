-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ORG_ADMIN');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "ProjectLifecycleStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED');

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "primary_domain" TEXT,
    "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL,
    "organization_id" UUID,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ORG_ADMIN',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "imgur_id" TEXT,
    "url" TEXT NOT NULL,
    "delete_hash" TEXT,
    "original_filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size_bytes" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "institution_name" TEXT NOT NULL,
    "group_name" TEXT NOT NULL,
    "acronym" TEXT,
    "general_description" TEXT NOT NULL,
    "mission" TEXT,
    "vision" TEXT,
    "logo_media_id" UUID,
    "academic_domain" TEXT,
    "institutional_email" TEXT,
    "address" TEXT,
    "color_primary" TEXT NOT NULL DEFAULT '#0f766e',
    "color_secondary" TEXT NOT NULL DEFAULT '#134e4a',
    "color_background" TEXT NOT NULL DEFAULT '#f8fafc',
    "color_surface" TEXT NOT NULL DEFAULT '#ffffff',
    "color_text" TEXT NOT NULL DEFAULT '#1e293b',
    "footer_text" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_social_links" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "site_settings_id" UUID NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "site_social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_settings" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "banner_media_id" UUID,
    "banner_title" TEXT NOT NULL,
    "banner_subtitle" TEXT,
    "contact_button_text" TEXT NOT NULL DEFAULT 'Contactar',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_settings" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "general_objective" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_objectives" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "about_settings_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "about_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_channels" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "contact_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_lines" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "researchers" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "institutional_email" TEXT NOT NULL,
    "orcid" TEXT,
    "photo_media_id" UUID,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "researchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "researcher_social_links" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "researcher_id" UUID NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "researcher_social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "results" TEXT,
    "main_media_id" UUID,
    "project_status" "ProjectLifecycleStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_researchers" (
    "organization_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "researcher_id" UUID NOT NULL,
    "role" TEXT,

    CONSTRAINT "project_researchers_pkey" PRIMARY KEY ("project_id","researcher_id")
);

-- CreateTable
CREATE TABLE "project_research_lines" (
    "organization_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "research_line_id" UUID NOT NULL,

    CONSTRAINT "project_research_lines_pkey" PRIMARY KEY ("project_id","research_line_id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "researcher_id" UUID,
    "full_name" TEXT NOT NULL,
    "orcid" TEXT,
    "external_profile_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "citation" TEXT NOT NULL,
    "cover_media_id" UUID,
    "doi" TEXT,
    "external_link" TEXT,
    "project_id" UUID,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_authors" (
    "publication_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "author_order" INTEGER NOT NULL,

    CONSTRAINT "publication_authors_pkey" PRIMARY KEY ("publication_id","author_id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "main_media_id" UUID,
    "published_at" DATE NOT NULL,
    "project_id" UUID,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_primary_domain_key" ON "organizations"("primary_domain");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_admin_id_idx" ON "refresh_tokens"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_files_imgur_id_key" ON "media_files"("imgur_id");

-- CreateIndex
CREATE INDEX "media_files_organization_id_idx" ON "media_files"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_organization_id_key" ON "site_settings"("organization_id");

-- CreateIndex
CREATE INDEX "site_social_links_organization_id_idx" ON "site_social_links"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_social_links_site_settings_id_platform_key" ON "site_social_links"("site_settings_id", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "home_settings_organization_id_key" ON "home_settings"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "about_settings_organization_id_key" ON "about_settings"("organization_id");

-- CreateIndex
CREATE INDEX "about_objectives_organization_id_idx" ON "about_objectives"("organization_id");

-- CreateIndex
CREATE INDEX "contact_channels_organization_id_idx" ON "contact_channels"("organization_id");

-- CreateIndex
CREATE INDEX "research_lines_organization_id_status_display_order_idx" ON "research_lines"("organization_id", "status", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "research_lines_organization_id_title_key" ON "research_lines"("organization_id", "title");

-- CreateIndex
CREATE INDEX "researchers_organization_id_status_display_order_idx" ON "researchers"("organization_id", "status", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "researchers_organization_id_institutional_email_key" ON "researchers"("organization_id", "institutional_email");

-- CreateIndex
CREATE UNIQUE INDEX "researchers_organization_id_orcid_key" ON "researchers"("organization_id", "orcid");

-- CreateIndex
CREATE INDEX "researcher_social_links_organization_id_idx" ON "researcher_social_links"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "researcher_social_links_researcher_id_platform_key" ON "researcher_social_links"("researcher_id", "platform");

-- CreateIndex
CREATE INDEX "projects_organization_id_status_display_order_idx" ON "projects"("organization_id", "status", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "projects_organization_id_slug_key" ON "projects"("organization_id", "slug");

-- CreateIndex
CREATE INDEX "project_researchers_organization_id_idx" ON "project_researchers"("organization_id");

-- CreateIndex
CREATE INDEX "project_research_lines_organization_id_idx" ON "project_research_lines"("organization_id");

-- CreateIndex
CREATE INDEX "authors_organization_id_idx" ON "authors"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "authors_organization_id_orcid_key" ON "authors"("organization_id", "orcid");

-- CreateIndex
CREATE INDEX "publications_organization_id_status_display_order_idx" ON "publications"("organization_id", "status", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "publications_organization_id_slug_key" ON "publications"("organization_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "publications_organization_id_doi_key" ON "publications"("organization_id", "doi");

-- CreateIndex
CREATE UNIQUE INDEX "publication_authors_publication_id_author_order_key" ON "publication_authors"("publication_id", "author_order");

-- CreateIndex
CREATE INDEX "news_organization_id_status_display_order_published_at_idx" ON "news"("organization_id", "status", "display_order", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "news_organization_id_slug_key" ON "news"("organization_id", "slug");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_media_id_fkey" FOREIGN KEY ("logo_media_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_social_links" ADD CONSTRAINT "site_social_links_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_social_links" ADD CONSTRAINT "site_social_links_site_settings_id_fkey" FOREIGN KEY ("site_settings_id") REFERENCES "site_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_settings" ADD CONSTRAINT "home_settings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_settings" ADD CONSTRAINT "home_settings_banner_media_id_fkey" FOREIGN KEY ("banner_media_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "about_settings" ADD CONSTRAINT "about_settings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "about_objectives" ADD CONSTRAINT "about_objectives_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "about_objectives" ADD CONSTRAINT "about_objectives_about_settings_id_fkey" FOREIGN KEY ("about_settings_id") REFERENCES "about_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_channels" ADD CONSTRAINT "contact_channels_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_lines" ADD CONSTRAINT "research_lines_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "researchers" ADD CONSTRAINT "researchers_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "researchers" ADD CONSTRAINT "researchers_photo_media_id_fkey" FOREIGN KEY ("photo_media_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "researcher_social_links" ADD CONSTRAINT "researcher_social_links_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "researcher_social_links" ADD CONSTRAINT "researcher_social_links_researcher_id_fkey" FOREIGN KEY ("researcher_id") REFERENCES "researchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_main_media_id_fkey" FOREIGN KEY ("main_media_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_researchers" ADD CONSTRAINT "project_researchers_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_researchers" ADD CONSTRAINT "project_researchers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_researchers" ADD CONSTRAINT "project_researchers_researcher_id_fkey" FOREIGN KEY ("researcher_id") REFERENCES "researchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_research_lines" ADD CONSTRAINT "project_research_lines_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_research_lines" ADD CONSTRAINT "project_research_lines_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_research_lines" ADD CONSTRAINT "project_research_lines_research_line_id_fkey" FOREIGN KEY ("research_line_id") REFERENCES "research_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_researcher_id_fkey" FOREIGN KEY ("researcher_id") REFERENCES "researchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_authors" ADD CONSTRAINT "publication_authors_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_authors" ADD CONSTRAINT "publication_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_main_media_id_fkey" FOREIGN KEY ("main_media_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
