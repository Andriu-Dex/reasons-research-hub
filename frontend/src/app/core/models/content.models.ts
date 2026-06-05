export type AdminRole = 'SUPER_ADMIN' | 'ORG_ADMIN';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
export type OrganizationStatus = 'ACTIVE' | 'INACTIVE';
export type ProjectLifecycleStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
export type NewsCategory = 'UPDATE' | 'EVENT' | 'AGREEMENT';

export interface MediaFile {
  id: string;
  url: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  primaryDomain?: string | null;
  status: OrganizationStatus;
}

export interface SiteSettings {
  id: string;
  organizationId: string;
  institutionName: string;
  groupName: string;
  acronym?: string | null;
  generalDescription: string;
  mission?: string | null;
  vision?: string | null;
  logoMediaId?: string | null;
  logo?: MediaFile | null;
  academicDomain?: string | null;
  institutionalEmail?: string | null;
  address?: string | null;
  colorPrimary: string;
  colorSecondary: string;
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  footerText?: string | null;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  displayOrder: number;
}

export interface HomeSettings {
  id: string;
  bannerMediaId?: string | null;
  banner?: MediaFile | null;
  bannerTitle: string;
  bannerSubtitle?: string | null;
  contactButtonText: string;
}

export interface AboutSettings {
  id: string;
  description: string;
  generalObjective?: string | null;
  objectives: AboutObjective[];
}

export interface AboutObjective {
  id?: string;
  description: string;
  displayOrder: number;
}

export interface ContactChannel {
  id: string;
  type: string;
  value: string;
  label?: string | null;
  isEnabled: boolean;
  displayOrder: number;
}

export interface ResearchLine {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  status: ContentStatus;
  displayOrder: number;
}

export interface Researcher {
  id: string;
  fullName: string;
  position: string;
  biography: string;
  institutionalEmail: string;
  orcid?: string | null;
  photoMediaId?: string | null;
  photo?: MediaFile | null;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  socialLinks?: SocialLink[];
}

export interface ProjectResearcher {
  researcher: Researcher;
  role?: string | null;
}

export interface ProjectResearchLine {
  researchLine: ResearchLine;
}

export type ProjectType = 'ACADEMIC' | 'RESEARCH';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  objectives: string;
  results?: string | null;
  mainMediaId?: string | null;
  mainImage?: MediaFile | null;
  projectStatus: ProjectLifecycleStatus;
  projectType: ProjectType;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  researchers?: ProjectResearcher[];
  researchLines?: ProjectResearchLine[];
}

export interface Author {
  id: string;
  researcherId?: string | null;
  fullName: string;
  orcid?: string | null;
  externalProfileUrl?: string | null;
}

export interface PublicationAuthor {
  author: Author;
  authorOrder: number;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  citation: string;
  coverMediaId?: string | null;
  coverImage?: MediaFile | null;
  doi?: string | null;
  externalLink?: string | null;
  projectId?: string | null;
  project?: Project | null;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  publishedAt?: string | null;
  authors?: PublicationAuthor[];
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  mainMediaId?: string | null;
  mainImage?: MediaFile | null;
  publishedAt: string;
  projectId?: string | null;
  project?: Project | null;
  newsCategory: NewsCategory;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
}

export interface HomePayload {
  siteSettings?: SiteSettings | null;
  homeSettings?: any;
  researchers: Researcher[];
  projects: Project[];
  publications: Publication[];
  news: NewsItem[];
  socialLinks?: SocialLink[];
}
