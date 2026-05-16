export type AdminRole = 'SUPER_ADMIN' | 'ORG_ADMIN';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface AuthAdmin {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  organizationId: string | null;
  organizationSlug: string | null;
  organizationName: string | null;
}

export interface AuthSession {
  accessToken: string;
  admin: AuthAdmin;
}

export interface SiteSettings {
  institutionName: string;
  groupName: string;
  acronym?: string;
  generalDescription: string;
  mission?: string;
  vision?: string;
  academicDomain?: string;
  institutionalEmail?: string;
  address?: string;
  colorPrimary: string;
  colorSecondary: string;
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  footerText?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  logo?: { url: string } | null;
}

export interface HomeResponse {
  siteSettings: SiteSettings;
  homeSettings: {
    bannerTitle: string;
    bannerSubtitle?: string;
    contactButtonText: string;
    banner?: { url: string } | null;
  };
  researchers: any[];
  projects: any[];
  publications: any[];
  news: any[];
}
