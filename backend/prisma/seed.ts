import { PrismaClient, type ContentStatus, type ProjectLifecycleStatus } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();
const defaultPassword = 'Admin12345!';

type OrganizationSeed = {
  name: string;
  slug: string;
  primaryDomain: string;
  adminEmail: string;
  adminName: string;
  institutionName: string;
  groupName: string;
  acronym: string;
  email: string;
  address: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  logoUrl: string;
  bannerUrl: string;
};

async function upsertMedia(organizationId: string, key: string, url: string, originalFilename: string) {
  return prisma.mediaFile.upsert({
    where: { imgurId: key },
    update: { url, originalFilename },
    create: {
      organizationId,
      imgurId: key,
      url,
      originalFilename,
      mimeType: 'image/webp',
      fileSizeBytes: 96_000
    }
  });
}

async function upsertResearchLine(organizationId: string, title: string, description: string, status: ContentStatus, displayOrder: number) {
  return prisma.researchLine.upsert({
    where: { organizationId_title: { organizationId, title } },
    update: { description, status, displayOrder },
    create: {
      organizationId,
      title,
      description,
      icon: title.slice(0, 2).toUpperCase(),
      status,
      displayOrder
    }
  });
}

async function upsertResearcher(
  organizationId: string,
  fullName: string,
  position: string,
  email: string,
  orcid: string,
  photoMediaId: string,
  status: ContentStatus,
  displayOrder: number,
  isFeatured = false
) {
  return prisma.researcher.upsert({
    where: { organizationId_orcid: { organizationId, orcid } },
    update: { fullName, position, institutionalEmail: email, photoMediaId, status, displayOrder, isFeatured },
    create: {
      organizationId,
      fullName,
      position,
      biography:
        'Perfil academico de prueba para validar visualizacion publica, administracion y aislamiento por organizacion.',
      institutionalEmail: email,
      orcid,
      photoMediaId,
      isFeatured,
      status,
      displayOrder
    }
  });
}

async function upsertAuthor(organizationId: string, fullName: string, orcid: string, researcherId?: string) {
  return prisma.author.upsert({
    where: { organizationId_orcid: { organizationId, orcid } },
    update: { fullName, researcherId },
    create: {
      organizationId,
      researcherId,
      fullName,
      orcid,
      externalProfileUrl: `https://orcid.org/${orcid}`
    }
  });
}

async function upsertProject(
  organizationId: string,
  title: string,
  slug: string,
  mainMediaId: string,
  status: ContentStatus,
  projectStatus: ProjectLifecycleStatus,
  displayOrder: number,
  isFeatured = false
) {
  return prisma.project.upsert({
    where: { organizationId_slug: { organizationId, slug } },
    update: { title, mainMediaId, status, projectStatus, displayOrder, isFeatured },
    create: {
      organizationId,
      title,
      slug,
      description:
        'Proyecto de prueba para validar gestion administrativa, relaciones, imagenes y visualizacion publica.',
      objectives:
        'Evaluar una arquitectura configurable para investigacion academica, colaboracion institucional y divulgacion.',
      results: status === 'PUBLISHED' ? 'Resultados preliminares disponibles para la comunidad academica.' : 'Resultados internos en revision.',
      mainMediaId,
      projectStatus,
      isFeatured,
      status,
      displayOrder
    }
  });
}

async function linkProject(organizationId: string, projectId: string, researcherId: string, researchLineId: string) {
  await prisma.projectResearcher.upsert({
    where: { projectId_researcherId: { projectId, researcherId } },
    update: { role: 'Investigador principal' },
    create: { organizationId, projectId, researcherId, role: 'Investigador principal' }
  });

  await prisma.projectResearchLine.upsert({
    where: { projectId_researchLineId: { projectId, researchLineId } },
    update: {},
    create: { organizationId, projectId, researchLineId }
  });
}

async function upsertPublication(
  organizationId: string,
  projectId: string,
  coverMediaId: string,
  authorId: string,
  title: string,
  slug: string,
  doi: string,
  status: ContentStatus,
  displayOrder: number
) {
  const publication = await prisma.publication.upsert({
    where: { organizationId_slug: { organizationId, slug } },
    update: { title, doi, projectId, coverMediaId, status, displayOrder },
    create: {
      organizationId,
      title,
      slug,
      abstract:
        'Publicacion de prueba para comprobar autores, DOI, estados de publicacion y filtrado publico.',
      citation: `${title}. Revista Academica de Innovacion, 2026.`,
      coverMediaId,
      doi,
      externalLink: `https://doi.org/${doi}`,
      projectId,
      isFeatured: status === 'PUBLISHED',
      status,
      displayOrder,
      publishedAt: new Date('2026-01-15')
    }
  });

  await prisma.publicationAuthor.upsert({
    where: { publicationId_authorId: { publicationId: publication.id, authorId } },
    update: { authorOrder: 1 },
    create: { publicationId: publication.id, authorId, authorOrder: 1 }
  });

  return publication;
}

async function upsertNews(
  organizationId: string,
  projectId: string,
  mainMediaId: string,
  title: string,
  slug: string,
  status: ContentStatus,
  displayOrder: number
) {
  return prisma.news.upsert({
    where: { organizationId_slug: { organizationId, slug } },
    update: { title, projectId, mainMediaId, status, displayOrder },
    create: {
      organizationId,
      title,
      slug,
      summary: 'Noticia de prueba para validar portada, listado publico y estados de contenido.',
      content:
        'Este registro permite comprobar la administracion de noticias, su relacion con proyectos y la visibilidad publica segun estado.',
      mainMediaId,
      publishedAt: new Date('2026-05-15'),
      projectId,
      isFeatured: status === 'PUBLISHED',
      status,
      displayOrder
    }
  });
}

async function seedOrganization(seed: OrganizationSeed, passwordHash: string) {
  const organization = await prisma.organization.upsert({
    where: { slug: seed.slug },
    update: { name: seed.name, primaryDomain: seed.primaryDomain, status: 'ACTIVE' },
    create: {
      name: seed.name,
      slug: seed.slug,
      primaryDomain: seed.primaryDomain,
      siteSettings: {
        create: {
          institutionName: seed.institutionName,
          groupName: seed.groupName,
          acronym: seed.acronym,
          generalDescription:
            'Plataforma academica para la gestion y divulgacion de investigacion, proyectos, publicaciones y actividades institucionales.',
          mission: 'Impulsar investigacion aplicada, colaborativa y verificable con impacto academico y social.',
          vision: 'Ser un referente en investigacion interdisciplinaria, innovacion y transferencia de conocimiento.',
          academicDomain: 'Investigacion, tecnologia e innovacion academica',
          institutionalEmail: seed.email,
          address: seed.address,
          footerText: `${seed.institutionName} - ${seed.groupName}`,
          colorPrimary: seed.colors.primary,
          colorSecondary: seed.colors.secondary,
          colorBackground: seed.colors.background,
          colorSurface: seed.colors.surface,
          colorText: seed.colors.text
        }
      },
      homeSettings: {
        create: {
          bannerTitle: `${seed.groupName}: investigacion con identidad propia`,
          bannerSubtitle:
            'Explora investigadores, lineas, proyectos, publicaciones y noticias desde un portal dinamico.',
          contactButtonText: 'Contactar al equipo'
        }
      },
      aboutSettings: {
        create: {
          description:
            `${seed.groupName} es un espacio academico orientado a fortalecer la colaboracion, la produccion cientifica y la divulgacion institucional.`,
          generalObjective:
            'Organizar y difundir produccion investigativa mediante una plataforma clara, segura y escalable.'
        }
      }
    }
  });

  const logo = await upsertMedia(organization.id, `seed-${seed.slug}-logo`, seed.logoUrl, `${seed.slug}-logo.webp`);
  const banner = await upsertMedia(organization.id, `seed-${seed.slug}-banner`, seed.bannerUrl, `${seed.slug}-banner.webp`);
  const portrait = await upsertMedia(organization.id, `seed-${seed.slug}-portrait`, 'https://i.imgur.com/6VBx3io.jpeg', `${seed.slug}-portrait.webp`);
  const projectImage = await upsertMedia(organization.id, `seed-${seed.slug}-project`, 'https://i.imgur.com/8Km9tLL.jpeg', `${seed.slug}-project.webp`);

  const siteSettings = await prisma.siteSettings.update({
    where: { organizationId: organization.id },
    data: {
      institutionName: seed.institutionName,
      groupName: seed.groupName,
      acronym: seed.acronym,
      logoMediaId: logo.id,
      institutionalEmail: seed.email,
      address: seed.address,
      colorPrimary: seed.colors.primary,
      colorSecondary: seed.colors.secondary,
      colorBackground: seed.colors.background,
      colorSurface: seed.colors.surface,
      colorText: seed.colors.text
    }
  });

  await prisma.homeSettings.update({
    where: { organizationId: organization.id },
    data: { bannerMediaId: banner.id }
  });

  await prisma.siteSocialLink.createMany({
    data: [
      { organizationId: organization.id, siteSettingsId: siteSettings.id, platform: 'LinkedIn', url: 'https://www.linkedin.com', displayOrder: 1 },
      { organizationId: organization.id, siteSettingsId: siteSettings.id, platform: 'ResearchGate', url: 'https://www.researchgate.net', displayOrder: 2 }
    ],
    skipDuplicates: true
  });

  const aboutSettings = await prisma.aboutSettings.findUniqueOrThrow({ where: { organizationId: organization.id } });
  if ((await prisma.aboutObjective.count({ where: { aboutSettingsId: aboutSettings.id } })) === 0) {
    await prisma.aboutObjective.createMany({
      data: [
        { organizationId: organization.id, aboutSettingsId: aboutSettings.id, description: 'Centralizar informacion academica confiable.', displayOrder: 1 },
        { organizationId: organization.id, aboutSettingsId: aboutSettings.id, description: 'Visibilizar proyectos, investigadores y publicaciones.', displayOrder: 2 },
        { organizationId: organization.id, aboutSettingsId: aboutSettings.id, description: 'Proteger la administracion por organizacion.', displayOrder: 3 }
      ]
    });
  }

  const contactChannels = [
    { type: 'email', value: seed.email, label: 'Correo institucional', displayOrder: 1 },
    { type: 'address', value: seed.address, label: 'Direccion', displayOrder: 2 },
    { type: 'phone', value: '+593 3 000 0000', label: 'Telefono', displayOrder: 3 }
  ];

  for (const channel of contactChannels) {
    const existingChannel = await prisma.contactChannel.findFirst({
      where: { organizationId: organization.id, type: channel.type, value: channel.value }
    });

    if (!existingChannel) {
      await prisma.contactChannel.create({ data: { ...channel, organizationId: organization.id } });
    }
  }

  await prisma.admin.upsert({
    where: { email: seed.adminEmail },
    update: { organizationId: organization.id, fullName: seed.adminName, passwordHash, role: 'ORG_ADMIN', isActive: true },
    create: {
      organizationId: organization.id,
      fullName: seed.adminName,
      email: seed.adminEmail,
      passwordHash,
      role: 'ORG_ADMIN'
    }
  });

  const publishedLine = await upsertResearchLine(
    organization.id,
    'Tecnologias inteligentes aplicadas',
    'Uso de software, datos e inteligencia artificial para resolver problemas academicos y sociales.',
    'PUBLISHED',
    1
  );
  await upsertResearchLine(organization.id, 'Linea en evaluacion interna', 'Contenido borrador para validar que no aparece publicamente.', 'DRAFT', 2);
  await upsertResearchLine(organization.id, 'Linea archivada', 'Contenido oculto para validar filtros publicos.', 'HIDDEN', 3);

  const researcher = await upsertResearcher(
    organization.id,
    `Investigador Principal ${seed.acronym}`,
    'Docente investigador',
    `investigador@${seed.slug}.edu.ec`,
    seed.slug === 'uta-reasons' ? '0000-0000-0000-0001' : '0000-0000-0000-0002',
    portrait.id,
    'PUBLISHED',
    1,
    true
  );
  await upsertResearcher(
    organization.id,
    `Investigador Borrador ${seed.acronym}`,
    'Investigador asociado',
    `borrador@${seed.slug}.edu.ec`,
    seed.slug === 'uta-reasons' ? '0000-0000-0000-0101' : '0000-0000-0000-0102',
    portrait.id,
    'DRAFT',
    2
  );

  const author = await upsertAuthor(organization.id, researcher.fullName, researcher.orcid ?? `seed-${seed.slug}-orcid`, researcher.id);
  const project = await upsertProject(
    organization.id,
    `Plataforma dinamica de investigacion ${seed.acronym}`,
    `plataforma-investigacion-${seed.slug}`,
    projectImage.id,
    'PUBLISHED',
    'IN_PROGRESS',
    1,
    true
  );
  await linkProject(organization.id, project.id, researcher.id, publishedLine.id);

  const draftProject = await upsertProject(
    organization.id,
    `Proyecto interno ${seed.acronym}`,
    `proyecto-interno-${seed.slug}`,
    projectImage.id,
    'DRAFT',
    'PLANNED',
    2
  );
  await linkProject(organization.id, draftProject.id, researcher.id, publishedLine.id);

  await upsertPublication(
    organization.id,
    project.id,
    projectImage.id,
    author.id,
    `Arquitectura multi-tenant para investigacion ${seed.acronym}`,
    `arquitectura-multitenant-${seed.slug}`,
    seed.slug === 'uta-reasons' ? '10.0000/reasons.2026.001' : '10.0000/andes.2026.001',
    'PUBLISHED',
    1
  );
  await upsertPublication(
    organization.id,
    draftProject.id,
    projectImage.id,
    author.id,
    `Publicacion en revision ${seed.acronym}`,
    `publicacion-revision-${seed.slug}`,
    seed.slug === 'uta-reasons' ? '10.0000/reasons.2026.099' : '10.0000/andes.2026.099',
    'DRAFT',
    2
  );

  await upsertNews(organization.id, project.id, projectImage.id, `Inicio del portal ${seed.acronym}`, `inicio-portal-${seed.slug}`, 'PUBLISHED', 1);
  await upsertNews(organization.id, draftProject.id, projectImage.id, `Noticia interna ${seed.acronym}`, `noticia-interna-${seed.slug}`, 'HIDDEN', 2);

  return organization;
}

async function main() {
  const passwordHash = await argon2.hash(defaultPassword);

  await seedOrganization({
    name: 'Universidad Tecnica de Ambato - REASONS',
    slug: 'uta-reasons',
    primaryDomain: 'reasons.localhost',
    adminEmail: 'admin@uta.edu.ec',
    adminName: 'Administrador REASONS',
    institutionName: 'Universidad Tecnica de Ambato',
    groupName: 'REASONS Research Hub',
    acronym: 'REASONS',
    email: 'reasons@uta.edu.ec',
    address: 'Ambato, Tungurahua, Ecuador',
    colors: {
      primary: '#00346f',
      secondary: '#006688',
      background: '#f7f9ff',
      surface: '#ffffff',
      text: '#111c2d'
    },
    logoUrl: 'https://i.imgur.com/RARaC9j.png',
    bannerUrl: 'https://i.imgur.com/GIP46xu.jpeg'
  }, passwordHash);

  await seedOrganization({
    name: 'Andes Innovation Lab',
    slug: 'andes-lab',
    primaryDomain: 'andes-lab.test',
    adminEmail: 'admin@andes.edu.ec',
    adminName: 'Administrador Andes Lab',
    institutionName: 'Andes Innovation Lab',
    groupName: 'Andes Research Hub',
    acronym: 'ANDES',
    email: 'contacto@andes.edu.ec',
    address: 'Quito, Pichincha, Ecuador',
    colors: {
      primary: '#214e34',
      secondary: '#b8792b',
      background: '#fbf7ef',
      surface: '#ffffff',
      text: '#1f251f'
    },
    logoUrl: 'https://i.imgur.com/RARaC9j.png',
    bannerUrl: 'https://i.imgur.com/1qgQZQy.jpeg'
  }, passwordHash);

  await prisma.admin.upsert({
    where: { email: 'superadmin@reasons.local' },
    update: { fullName: 'Super Administrador', passwordHash, role: 'SUPER_ADMIN', isActive: true },
    create: {
      organizationId: null,
      fullName: 'Super Administrador',
      email: 'superadmin@reasons.local',
      passwordHash,
      role: 'SUPER_ADMIN'
    }
  });

  console.log(`Seed completed. Password for seeded admins: ${defaultPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
