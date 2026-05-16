import { z } from 'zod';

export const flexibleBodySchema = z.record(z.string(), z.unknown());

const optionalString = z.string().trim().optional().nullable();
const optionalNumber = z.coerce.number().int().optional();
const optionalBoolean = z.coerce.boolean().optional();

export const siteSettingsSchema = z.object({
  institutionName: z.string().min(2),
  groupName: z.string().min(2),
  acronym: optionalString,
  generalDescription: z.string().min(10),
  mission: optionalString,
  vision: optionalString,
  logoMediaId: optionalString,
  academicDomain: optionalString,
  institutionalEmail: optionalString,
  address: optionalString,
  colorPrimary: z.string().default('#0f766e'),
  colorSecondary: z.string().default('#164e63'),
  colorBackground: z.string().default('#f6f8f9'),
  colorSurface: z.string().default('#ffffff'),
  colorText: z.string().default('#172026'),
  footerText: optionalString
});

export const homeSettingsSchema = z.object({
  bannerMediaId: optionalString,
  bannerTitle: z.string().min(3),
  bannerSubtitle: optionalString,
  contactButtonText: z.string().min(2)
});

export const aboutSettingsSchema = z.object({
  description: z.string().min(10),
  generalObjective: optionalString,
  objectives: z.array(z.object({
    description: z.string().min(3),
    displayOrder: z.coerce.number().int().default(0)
  })).default([])
});

export const organizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  primaryDomain: optionalString,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE')
});

export const contactChannelSchema = z.object({
  type: z.string().min(2),
  value: z.string().min(2),
  label: optionalString,
  isEnabled: optionalBoolean.default(true),
  displayOrder: optionalNumber.default(0)
});

export const researchLineSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  icon: optionalString,
  status: z.enum(['DRAFT', 'PUBLISHED', 'HIDDEN']).default('DRAFT'),
  displayOrder: optionalNumber.default(0)
});

export const researcherSchema = z.object({
  fullName: z.string().min(2),
  position: z.string().min(2),
  biography: z.string().min(5),
  institutionalEmail: z.string().email(),
  orcid: optionalString,
  photoMediaId: optionalString,
  isFeatured: optionalBoolean.default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'HIDDEN']).default('DRAFT'),
  displayOrder: optionalNumber.default(0),
  socialLinks: z.array(z.object({
    platform: z.string().min(2),
    url: z.string().url(),
    displayOrder: z.coerce.number().int().default(0)
  })).default([])
});

export const projectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(5),
  objectives: z.string().min(5),
  results: optionalString,
  mainMediaId: optionalString,
  projectStatus: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED']).default('IN_PROGRESS'),
  isFeatured: optionalBoolean.default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'HIDDEN']).default('DRAFT'),
  displayOrder: optionalNumber.default(0),
  researcherIds: z.array(z.string().uuid()).default([]),
  researchLineIds: z.array(z.string().uuid()).default([])
});

export const authorSchema = z.object({
  researcherId: optionalString,
  fullName: z.string().min(2),
  orcid: optionalString,
  externalProfileUrl: optionalString
});

export const publicationSchema = z.object({
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  abstract: z.string().min(5),
  citation: z.string().min(5),
  coverMediaId: optionalString,
  doi: optionalString,
  externalLink: optionalString,
  projectId: optionalString,
  isFeatured: optionalBoolean.default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'HIDDEN']).default('DRAFT'),
  displayOrder: optionalNumber.default(0),
  publishedAt: optionalString,
  authorIds: z.array(z.string().uuid()).default([])
});

export const newsSchema = z.object({
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(5),
  content: z.string().min(5),
  mainMediaId: optionalString,
  publishedAt: z.string(),
  projectId: optionalString,
  isFeatured: optionalBoolean.default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'HIDDEN']).default('DRAFT'),
  displayOrder: optionalNumber.default(0)
});
