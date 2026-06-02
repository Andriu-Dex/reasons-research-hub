import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../shared/http-error.js';
import argon2 from 'argon2';

type ResourceName =
  | 'contact-channels'
  | 'research-lines'
  | 'researchers'
  | 'projects'
  | 'authors'
  | 'publications'
  | 'news';

const resourceModels: Record<ResourceName, string> = {
  'contact-channels': 'contactChannel',
  'research-lines': 'researchLine',
  researchers: 'researcher',
  projects: 'project',
  authors: 'author',
  publications: 'publication',
  news: 'news'
};

function dbModel(resource: ResourceName) {
  return (prisma as unknown as Record<string, any>)[resourceModels[resource]];
}

function ensureResource(resource: string): asserts resource is ResourceName {
  if (!(resource in resourceModels)) {
    throw new HttpError(404, 'Modulo administrativo no encontrado.');
  }
}

function parseDate(value: unknown) {
  return typeof value === 'string' && value ? new Date(value) : null;
}

export class AdminService {
  async getDashboard(organizationId: string) {
    const [researchers, projects, publications, news, researchLines, mediaFiles] = await Promise.all([
      prisma.researcher.count({ where: { organizationId } }),
      prisma.project.count({ where: { organizationId } }),
      prisma.publication.count({ where: { organizationId } }),
      prisma.news.count({ where: { organizationId } }),
      prisma.researchLine.count({ where: { organizationId } }),
      prisma.mediaFile.count({ where: { organizationId } })
    ]);

    const recentNews = await prisma.news.findMany({
      where: { organizationId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, status: true, updatedAt: true }
    });

    return {
      counts: { researchers, projects, publications, news, researchLines, mediaFiles },
      recentNews
    };
  }

  async getProfile(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        organizationId: true,
        organization: { select: { name: true, slug: true } }
      }
    });
    if (!admin) throw new HttpError(404, 'Administrador no encontrado.');
    return admin;
  }

  async updateProfile(adminId: string, data: { fullName: string; email: string }) {
    try {
      return await prisma.admin.update({
        where: { id: adminId },
        data,
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          organizationId: true,
          organization: { select: { name: true, slug: true } }
        }
      });
    } catch {
      throw new HttpError(409, 'El correo ya esta registrado por otro administrador.');
    }
  }

  async updatePassword(adminId: string, currentPassword: string, newPassword: string) {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin || !(await argon2.verify(admin.passwordHash, currentPassword))) {
      throw new HttpError(401, 'La contrasena actual no es correcta.');
    }

    await prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash: await argon2.hash(newPassword) }
    });
  }

  async list(resource: string, organizationId: string) {
    ensureResource(resource);
    return dbModel(resource).findMany({
      where: { organizationId },
      orderBy: this.orderFor(resource),
      include: this.includeFor(resource) as any
    });
  }

  async get(resource: string, id: string, organizationId: string) {
    ensureResource(resource);
    const item = await dbModel(resource).findFirst({
      where: { id, organizationId },
      include: this.includeFor(resource) as any
    });
    if (!item) throw new HttpError(404, 'Registro no encontrado.');
    return item;
  }

  async create(resource: string, organizationId: string, data: Record<string, unknown>) {
    ensureResource(resource);

    if (resource === 'researchers') return this.createResearcher(organizationId, data);
    if (resource === 'projects') return this.createProject(organizationId, data);
    if (resource === 'publications') return this.createPublication(organizationId, data);
    if (resource === 'news') return this.createNews(organizationId, data);

    return dbModel(resource).create({
      data: { ...data, organizationId }
    });
  }

  async update(resource: string, id: string, organizationId: string, data: Record<string, unknown>) {
    ensureResource(resource);
    await this.get(resource, id, organizationId);

    if (resource === 'researchers') return this.updateResearcher(id, organizationId, data);
    if (resource === 'projects') return this.updateProject(id, organizationId, data);
    if (resource === 'publications') return this.updatePublication(id, organizationId, data);
    if (resource === 'news') return this.updateNews(id, organizationId, data);

    return dbModel(resource).update({
      where: { id },
      data: data as any
    });
  }

  async remove(resource: string, id: string, organizationId: string) {
    ensureResource(resource);
    await this.get(resource, id, organizationId);
    await dbModel(resource).delete({ where: { id } });
  }

  async getSiteSettings(organizationId: string) {
    return prisma.siteSettings.findUnique({
      where: { organizationId },
      include: { socialLinks: { orderBy: { displayOrder: 'asc' as const } }, logo: true }
    });
  }

  async updateSiteSettings(organizationId: string, data: Record<string, unknown>) {
    await this.ensureMediaBelongsToOrganization(organizationId, data.logoMediaId);
    return prisma.siteSettings.update({
      where: { organizationId },
      data: data as any,
      include: { socialLinks: { orderBy: { displayOrder: 'asc' as const } }, logo: true }
    });
  }

  async getHomeSettings(organizationId: string) {
    return prisma.homeSettings.findUnique({ where: { organizationId }, include: { banner: true } });
  }

  async updateHomeSettings(organizationId: string, data: Record<string, unknown>) {
    await this.ensureMediaBelongsToOrganization(organizationId, data.bannerMediaId);
    return prisma.homeSettings.update({ where: { organizationId }, data: data as any });
  }

  async getAboutSettings(organizationId: string) {
    return prisma.aboutSettings.findUnique({ where: { organizationId }, include: { objectives: true } });
  }

  async updateAboutSettings(organizationId: string, data: Record<string, unknown>) {
    const objectives = Array.isArray(data.objectives) ? data.objectives : [];
    const { objectives: _objectives, ...aboutData } = data;
    const about = await prisma.aboutSettings.update({ where: { organizationId }, data: aboutData as any });

    await prisma.aboutObjective.deleteMany({ where: { aboutSettingsId: about.id } });
    if (objectives.length) {
      await prisma.aboutObjective.createMany({
        data: objectives.map((objective: any) => ({
          organizationId,
          aboutSettingsId: about.id,
          description: objective.description,
          displayOrder: objective.displayOrder ?? 0
        }))
      });
    }

    return this.getAboutSettings(organizationId);
  }

  async listOrganizations() {
    return prisma.organization.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createOrganization(data: Record<string, any>) {
    return prisma.organization.create({
      data: {
        ...data,
        siteSettings: {
          create: {
            institutionName: data.name,
            groupName: data.name,
            generalDescription: 'Descripcion institucional pendiente de configurar.'
          }
        },
        homeSettings: { create: { bannerTitle: data.name, contactButtonText: 'Contactar' } },
        aboutSettings: { create: { description: 'Informacion institucional pendiente de configurar.' } }
      } as any
    });
  }

  async updateOrganization(id: string, data: Record<string, unknown>) {
    return prisma.organization.update({ where: { id }, data: data as any });
  }

  private includeFor(resource: ResourceName) {
    if (resource === 'researchers') return { photo: true, socialLinks: { orderBy: { displayOrder: 'asc' as const } } };
    if (resource === 'projects') return { mainImage: true, researchers: true, researchLines: true };
    if (resource === 'publications') return { coverImage: true, authors: { include: { author: true } }, project: true };
    if (resource === 'news') return { mainImage: true, project: true };
    return undefined;
  }

  private orderFor(resource: ResourceName) {
    if (resource === 'news') return [{ publishedAt: 'desc' as const }, { displayOrder: 'asc' as const }];
    if (resource === 'authors') return { fullName: 'asc' as const };
    return { displayOrder: 'asc' as const };
  }

  private async createResearcher(organizationId: string, data: Record<string, any>) {
    const { socialLinks = [], ...researcher } = data;
    await this.ensureMediaBelongsToOrganization(organizationId, researcher.photoMediaId);
    return prisma.researcher.create({
      data: {
        ...researcher,
        organizationId,
        socialLinks: {
          create: socialLinks.map((link: any) => ({ ...link, organizationId }))
        }
      } as any,
      include: this.includeFor('researchers') as any
    });
  }

  private async updateResearcher(id: string, organizationId: string, data: Record<string, any>) {
    const { socialLinks = [], ...researcher } = data;
    await this.ensureMediaBelongsToOrganization(organizationId, researcher.photoMediaId);
    await prisma.researcherSocialLink.deleteMany({ where: { researcherId: id, organizationId } });
    return prisma.researcher.update({
      where: { id },
      data: {
        ...researcher,
        socialLinks: {
          create: socialLinks.map((link: any) => ({ ...link, organizationId }))
        }
      } as any,
      include: this.includeFor('researchers') as any
    });
  }

  private async createProject(organizationId: string, data: Record<string, any>) {
    const { researcherIds = [], researchLineIds = [], ...project } = data;
    await Promise.all([
      this.ensureMediaBelongsToOrganization(organizationId, project.mainMediaId),
      this.ensureIdsBelongToOrganization('researcher', organizationId, researcherIds),
      this.ensureIdsBelongToOrganization('researchLine', organizationId, researchLineIds)
    ]);
    return prisma.project.create({
      data: {
        ...project,
        organizationId,
        researchers: {
          create: researcherIds.map((researcherId: string) => ({ organizationId, researcherId }))
        },
        researchLines: {
          create: researchLineIds.map((researchLineId: string) => ({ organizationId, researchLineId }))
        }
      } as any,
      include: this.includeFor('projects') as any
    });
  }

  private async updateProject(id: string, organizationId: string, data: Record<string, any>) {
    const { researcherIds = [], researchLineIds = [], ...project } = data;
    await Promise.all([
      this.ensureMediaBelongsToOrganization(organizationId, project.mainMediaId),
      this.ensureIdsBelongToOrganization('researcher', organizationId, researcherIds),
      this.ensureIdsBelongToOrganization('researchLine', organizationId, researchLineIds)
    ]);
    await prisma.projectResearcher.deleteMany({ where: { projectId: id, organizationId } });
    await prisma.projectResearchLine.deleteMany({ where: { projectId: id, organizationId } });
    return prisma.project.update({
      where: { id },
      data: {
        ...project,
        researchers: {
          create: researcherIds.map((researcherId: string) => ({ organizationId, researcherId }))
        },
        researchLines: {
          create: researchLineIds.map((researchLineId: string) => ({ organizationId, researchLineId }))
        }
      } as any,
      include: this.includeFor('projects') as any
    });
  }

  private async createPublication(organizationId: string, data: Record<string, any>) {
    const { authorIds = [], publishedAt, ...publication } = data;
    await Promise.all([
      this.ensureMediaBelongsToOrganization(organizationId, publication.coverMediaId),
      this.ensureIdsBelongToOrganization('author', organizationId, authorIds),
      this.ensureOptionalIdBelongsToOrganization('project', organizationId, publication.projectId)
    ]);
    return prisma.publication.create({
      data: {
        ...publication,
        publishedAt: parseDate(publishedAt),
        organizationId,
        authors: {
          create: authorIds.map((authorId: string, index: number) => ({ authorId, authorOrder: index + 1 }))
        }
      } as any,
      include: this.includeFor('publications') as any
    });
  }

  private async updatePublication(id: string, organizationId: string, data: Record<string, any>) {
    const { authorIds = [], publishedAt, ...publication } = data;
    await Promise.all([
      this.ensureMediaBelongsToOrganization(organizationId, publication.coverMediaId),
      this.ensureIdsBelongToOrganization('author', organizationId, authorIds),
      this.ensureOptionalIdBelongsToOrganization('project', organizationId, publication.projectId)
    ]);
    await prisma.publicationAuthor.deleteMany({ where: { publicationId: id } });
    return prisma.publication.update({
      where: { id },
      data: {
        ...publication,
        publishedAt: parseDate(publishedAt),
        authors: {
          create: authorIds.map((authorId: string, index: number) => ({ authorId, authorOrder: index + 1 }))
        }
      } as any,
      include: this.includeFor('publications') as any
    });
  }

  private async createNews(organizationId: string, data: Record<string, any>) {
    await Promise.all([
      this.ensureMediaBelongsToOrganization(organizationId, data.mainMediaId),
      this.ensureOptionalIdBelongsToOrganization('project', organizationId, data.projectId)
    ]);
    return prisma.news.create({
      data: { ...data, publishedAt: new Date(data.publishedAt), organizationId } as any,
      include: this.includeFor('news') as any
    });
  }

  private async updateNews(id: string, organizationId: string, data: Record<string, any>) {
    await Promise.all([
      this.ensureMediaBelongsToOrganization(organizationId, data.mainMediaId),
      this.ensureOptionalIdBelongsToOrganization('project', organizationId, data.projectId)
    ]);
    return prisma.news.update({
      where: { id },
      data: { ...data, publishedAt: new Date(data.publishedAt) } as any,
      include: this.includeFor('news') as any
    });
  }

  private async ensureMediaBelongsToOrganization(organizationId: string, mediaId: unknown) {
    if (!mediaId) return;
    const media = await prisma.mediaFile.findFirst({ where: { id: String(mediaId), organizationId } });
    if (!media) throw new HttpError(400, 'La imagen seleccionada no pertenece a esta organizacion.');
  }

  private async ensureOptionalIdBelongsToOrganization(model: string, organizationId: string, id: unknown) {
    if (!id) return;
    await this.ensureIdsBelongToOrganization(model, organizationId, [String(id)]);
  }

  private async ensureIdsBelongToOrganization(model: string, organizationId: string, ids: string[]) {
    if (!ids.length) return;
    const uniqueIds = Array.from(new Set(ids));
    const count = await (prisma as unknown as Record<string, any>)[model].count({
      where: { organizationId, id: { in: uniqueIds } }
    });
    if (count !== uniqueIds.length) {
      throw new HttpError(400, 'Uno o mas recursos relacionados no pertenecen a esta organizacion.');
    }
  }
}

export const adminService = new AdminService();
