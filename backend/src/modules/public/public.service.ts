import { prisma } from '../../lib/prisma.js';

const publishedOrder = [{ displayOrder: 'asc' as const }, { createdAt: 'desc' as const }];

export class PublicService {
  async getSiteSettings(organizationId: string) {
    return prisma.siteSettings.findUnique({
      where: { organizationId },
      include: {
        logo: true,
        socialLinks: { orderBy: { displayOrder: 'asc' } }
      }
    });
  }

  async getHome(organizationId: string) {
    const [siteSettings, homeSettings, researchers, projects, publications, news] = await Promise.all([
      this.getSiteSettings(organizationId),
      prisma.homeSettings.findUnique({ where: { organizationId }, include: { banner: true } }),
      prisma.researcher.findMany({
        where: { organizationId, status: 'PUBLISHED', isFeatured: true },
        include: { photo: true },
        orderBy: publishedOrder,
        take: 4
      }),
      prisma.project.findMany({
        where: { organizationId, status: 'PUBLISHED', isFeatured: true },
        include: { mainImage: true, researchLines: { include: { researchLine: true } } },
        orderBy: publishedOrder,
        take: 3
      }),
      prisma.publication.findMany({
        where: { organizationId, status: 'PUBLISHED' },
        include: { coverImage: true, authors: { include: { author: true }, orderBy: { authorOrder: 'asc' } } },
        orderBy: [{ publishedAt: 'desc' }, { displayOrder: 'asc' }],
        take: 3
      }),
      prisma.news.findMany({
        where: { organizationId, status: 'PUBLISHED' },
        include: { mainImage: true },
        orderBy: [{ publishedAt: 'desc' }, { displayOrder: 'asc' }],
        take: 3
      })
    ]);

    return { siteSettings, homeSettings, researchers, projects, publications, news };
  }

  async getAbout(organizationId: string) {
    return prisma.aboutSettings.findUnique({
      where: { organizationId },
      include: { objectives: { orderBy: { displayOrder: 'asc' } } }
    });
  }

  async getResearchLines(organizationId: string) {
    return prisma.researchLine.findMany({
      where: { organizationId, status: 'PUBLISHED' },
      orderBy: publishedOrder
    });
  }

  async getResearchers(organizationId: string) {
    return prisma.researcher.findMany({
      where: { organizationId, status: 'PUBLISHED' },
      include: { photo: true, socialLinks: { orderBy: { displayOrder: 'asc' } } },
      orderBy: publishedOrder
    });
  }

  async getProjects(organizationId: string) {
    return prisma.project.findMany({
      where: { organizationId, status: 'PUBLISHED' },
      include: {
        mainImage: true,
        researchers: { include: { researcher: true } },
        researchLines: { include: { researchLine: true } }
      },
      orderBy: publishedOrder
    });
  }

  async getPublications(organizationId: string) {
    return prisma.publication.findMany({
      where: { organizationId, status: 'PUBLISHED' },
      include: {
        coverImage: true,
        project: true,
        authors: { include: { author: true }, orderBy: { authorOrder: 'asc' } }
      },
      orderBy: [{ publishedAt: 'desc' }, { displayOrder: 'asc' }]
    });
  }

  async getNews(organizationId: string) {
    return prisma.news.findMany({
      where: { organizationId, status: 'PUBLISHED' },
      include: { mainImage: true, project: true },
      orderBy: [{ publishedAt: 'desc' }, { displayOrder: 'asc' }]
    });
  }
}

export const publicService = new PublicService();
