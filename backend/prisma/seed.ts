import {
  PrismaClient,
  ContentStatus,
  ProjectLifecycleStatus
} from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const defaultPassword = 'Admin12345!';

const statusCycle: ContentStatus[] = [
  ContentStatus.PUBLISHED,
  ContentStatus.PUBLISHED,
  ContentStatus.PUBLISHED,
  ContentStatus.DRAFT,
  ContentStatus.HIDDEN
];

const projectStatusCycle: ProjectLifecycleStatus[] = [
  ProjectLifecycleStatus.IN_PROGRESS,
  ProjectLifecycleStatus.PLANNED,
  ProjectLifecycleStatus.COMPLETED
];

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function upsertMedia(
  organizationId: string,
  key: string,
  url: string,
  originalFilename: string
) {
  return prisma.mediaFile.upsert({
    where: { imgurId: key },
    update: {
      url,
      originalFilename
    },
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

async function upsertResearchLine(
  organizationId: string,
  title: string,
  description: string,
  status: ContentStatus,
  displayOrder: number
) {
  return prisma.researchLine.upsert({
    where: {
      organizationId_title: {
        organizationId,
        title
      }
    },
    update: {
      description,
      status,
      displayOrder
    },
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
  data: {
    fullName: string;
    position: string;
    email: string;
    orcid: string;
    biography: string;
    photoMediaId: string;
    status: ContentStatus;
    displayOrder: number;
    isFeatured?: boolean;
  }
) {
  return prisma.researcher.upsert({
    where: {
      organizationId_orcid: {
        organizationId,
        orcid: data.orcid
      }
    },
    update: {
      fullName: data.fullName,
      position: data.position,
      biography: data.biography,
      institutionalEmail: data.email,
      photoMediaId: data.photoMediaId,
      status: data.status,
      displayOrder: data.displayOrder,
      isFeatured: data.isFeatured ?? false
    },
    create: {
      organizationId,
      fullName: data.fullName,
      position: data.position,
      biography: data.biography,
      institutionalEmail: data.email,
      orcid: data.orcid,
      photoMediaId: data.photoMediaId,
      status: data.status,
      displayOrder: data.displayOrder,
      isFeatured: data.isFeatured ?? false
    }
  });
}

async function upsertAuthor(
  organizationId: string,
  fullName: string,
  orcid: string,
  researcherId?: string
) {
  return prisma.author.upsert({
    where: {
      organizationId_orcid: {
        organizationId,
        orcid
      }
    },
    update: {
      fullName,
      researcherId
    },
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
  data: {
    title: string;
    slug: string;
    description: string;
    objectives: string;
    results: string;
    mainMediaId: string;
    status: ContentStatus;
    projectStatus: ProjectLifecycleStatus;
    displayOrder: number;
    isFeatured?: boolean;
  }
) {
  return prisma.project.upsert({
    where: {
      organizationId_slug: {
        organizationId,
        slug: data.slug
      }
    },
    update: {
      title: data.title,
      description: data.description,
      objectives: data.objectives,
      results: data.results,
      mainMediaId: data.mainMediaId,
      status: data.status,
      projectStatus: data.projectStatus,
      displayOrder: data.displayOrder,
      isFeatured: data.isFeatured ?? false
    },
    create: {
      organizationId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      objectives: data.objectives,
      results: data.results,
      mainMediaId: data.mainMediaId,
      status: data.status,
      projectStatus: data.projectStatus,
      displayOrder: data.displayOrder,
      isFeatured: data.isFeatured ?? false
    }
  });
}

async function linkProjectResearcher(
  organizationId: string,
  projectId: string,
  researcherId: string,
  role: string
) {
  await prisma.projectResearcher.upsert({
    where: {
      projectId_researcherId: {
        projectId,
        researcherId
      }
    },
    update: {
      role
    },
    create: {
      organizationId,
      projectId,
      researcherId,
      role
    }
  });
}

async function linkProjectResearchLine(
  organizationId: string,
  projectId: string,
  researchLineId: string
) {
  await prisma.projectResearchLine.upsert({
    where: {
      projectId_researchLineId: {
        projectId,
        researchLineId
      }
    },
    update: {},
    create: {
      organizationId,
      projectId,
      researchLineId
    }
  });
}

async function upsertPublication(
  organizationId: string,
  data: {
    projectId: string;
    coverMediaId: string;
    title: string;
    slug: string;
    abstract: string;
    citation: string;
    doi: string;
    status: ContentStatus;
    displayOrder: number;
    publishedAt: Date;
    authorIds: string[];
  }
) {
  const publication = await prisma.publication.upsert({
    where: {
      organizationId_slug: {
        organizationId,
        slug: data.slug
      }
    },
    update: {
      title: data.title,
      abstract: data.abstract,
      citation: data.citation,
      doi: data.doi,
      externalLink: `https://doi.org/${data.doi}`,
      projectId: data.projectId,
      coverMediaId: data.coverMediaId,
      status: data.status,
      displayOrder: data.displayOrder,
      publishedAt: data.publishedAt,
      isFeatured: data.status === ContentStatus.PUBLISHED && data.displayOrder <= 6
    },
    create: {
      organizationId,
      title: data.title,
      slug: data.slug,
      abstract: data.abstract,
      citation: data.citation,
      coverMediaId: data.coverMediaId,
      doi: data.doi,
      externalLink: `https://doi.org/${data.doi}`,
      projectId: data.projectId,
      status: data.status,
      displayOrder: data.displayOrder,
      publishedAt: data.publishedAt,
      isFeatured: data.status === ContentStatus.PUBLISHED && data.displayOrder <= 6
    }
  });

  for (let i = 0; i < data.authorIds.length; i++) {
    await prisma.publicationAuthor.upsert({
      where: {
        publicationId_authorId: {
          publicationId: publication.id,
          authorId: data.authorIds[i]
        }
      },
      update: {
        authorOrder: i + 1
      },
      create: {
        publicationId: publication.id,
        authorId: data.authorIds[i],
        authorOrder: i + 1
      }
    });
  }

  return publication;
}

async function upsertNews(
  organizationId: string,
  data: {
    projectId?: string;
    mainMediaId: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    status: ContentStatus;
    displayOrder: number;
    publishedAt: Date;
  }
) {
  return prisma.news.upsert({
    where: {
      organizationId_slug: {
        organizationId,
        slug: data.slug
      }
    },
    update: {
      title: data.title,
      summary: data.summary,
      content: data.content,
      projectId: data.projectId,
      mainMediaId: data.mainMediaId,
      status: data.status,
      displayOrder: data.displayOrder,
      publishedAt: data.publishedAt,
      isFeatured: data.status === ContentStatus.PUBLISHED && data.displayOrder <= 5
    },
    create: {
      organizationId,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      mainMediaId: data.mainMediaId,
      projectId: data.projectId,
      status: data.status,
      displayOrder: data.displayOrder,
      publishedAt: data.publishedAt,
      isFeatured: data.status === ContentStatus.PUBLISHED && data.displayOrder <= 5
    }
  });
}

const reasonsResearchers = [
  {
    fullName: 'Israel Naranjo Chiriboga',
    position: 'Director',
    email: 'ie.naranjo@uta.edu.ec',
    orcid: '0000-0001-5774-1879',
    biography:
      'Docente universitario en la carrera de Ingeniería Industrial en la Universidad Técnica de Ambato. Magíster en Gestión de Operaciones y estudiante doctoral en Ingeniería y Producción Industrial. Su investigación se centra en toma de decisiones sostenibles, PYMES del sector textil, cadena de suministro, análisis de datos, optimización y mejora de sistemas productivos.'
  },
  {
    fullName: 'Franklin Tigre Ortega',
    position: 'Subdirector',
    email: 'fg.tigre@uta.edu.ec',
    orcid: '0000-0003-0254-029X',
    biography:
      'Investigador orientado a la gestión de operaciones, mejora continua, sistemas productivos y aplicación de herramientas tecnológicas para fortalecer la eficiencia organizacional.'
  },
  {
    fullName: 'John Reyes Vásquez',
    position: 'Investigador',
    email: 'johnpreyes@uta.edu.ec',
    orcid: '0000-0002-5446-5490',
    biography:
      'Doctor en Ingeniería y Producción Industrial por la Universitat Politècnica de València. Profesor e investigador con experiencia en procesos logísticos, gestión operativa, análisis de riesgos, tecnologías de información, producción industrial, cadena de suministro, investigación de operaciones, manufactura ajustada, modelización y simulación en el contexto de Industria 4.0 y 5.0.'
  },
  {
    fullName: 'Carlos Sánchez Rosero',
    position: 'Investigador',
    email: 'carloshsanchez@uta.edu.ec',
    orcid: '0000-0002-2253-8448',
    biography:
      'Investigador académico vinculado al desarrollo de soluciones en ingeniería, optimización de procesos, sostenibilidad productiva y transferencia tecnológica.'
  },
  {
    fullName: 'Luis Morales Perrazo',
    position: 'Investigador',
    email: 'luisamorales@uta.edu.ec',
    orcid: '0000-0002-0921-262X',
    biography:
      'Investigador con interés en sistemas productivos, innovación tecnológica, gestión industrial y aplicación de metodologías de mejora para organizaciones públicas y privadas.'
  },
  {
    fullName: 'Freddy Lema Chicaiza',
    position: 'Investigador',
    email: 'fr.lema@uta.edu.ec',
    orcid: '0000-0001-5987-8975',
    biography:
      'Investigador enfocado en procesos industriales, análisis de datos, gestión de recursos y desarrollo de soluciones aplicadas para la eficiencia operativa.'
  },
  {
    fullName: 'Edgar Patricio Córdova Córdova',
    position: 'Investigador',
    email: 'edgarpcordovac@uta.edu.ec',
    orcid: '0000-0002-2866-287X',
    biography:
      'Investigador orientado a la integración de métodos de ingeniería, gestión de procesos, tecnologías aplicadas y sostenibilidad en sistemas organizacionales.'
  },
  {
    fullName: 'Christian Mariño Rivera',
    position: 'Investigador',
    email: 'christianjmarino@uta.edu.ec',
    orcid: '0000-0001-7039-8235',
    biography:
      'Investigador interesado en tecnologías emergentes, automatización, sistemas inteligentes, gestión de información y soluciones aplicadas para entornos productivos.'
  },
  {
    fullName: 'Ana Pamela Castro Martin',
    position: 'Investigador',
    email: 'ap.castro@uta.edu.ec',
    orcid: '0000-0002-7954-7871',
    biography:
      'Docente universitaria en Ingeniería en Telecomunicaciones e Ingeniería en Automatización y Robótica. Maestra en Sistemas de Manufactura e Ingeniera Mecatrónica. Su investigación se orienta a conectividad de máquinas, procesos de Industria 4.0 y 5.0, sistemas inteligentes e Internet de las Cosas.'
  },
  {
    fullName: 'Daysi Ortiz Guerrero',
    position: 'Investigador',
    email: 'dm.ortiz@uta.edu.ec',
    orcid: '0000-0001-6485-808X',
    biography:
      'Docente universitaria en Ingeniería Industrial de la Universidad Técnica de Ambato. Ingeniera Industrial en Procesos de Automatización y Magíster en Gestión de Operaciones. Su trabajo se orienta a planificación de producción, mejora continua, eficiencia operativa, manufactura esbelta y sostenibilidad en sistemas productivos.'
  },
  {
    fullName: 'César Rosero Mantilla',
    position: 'Investigador',
    email: 'cesararosero@uta.edu.ec',
    orcid: '0000-0001-7806-2955',
    biography:
      'Investigador vinculado al análisis de sistemas productivos, innovación, sostenibilidad, gestión tecnológica y desarrollo de soluciones aplicadas para la industria.'
  }
];

const researchLines = [
  {
    title: 'Diseño, Materiales, Producción, Identidad, Sostenibilidad y Tecnologías Aplicadas',
    description:
      'Línea orientada al diseño, materiales y sistemas productivos desde un enfoque sostenible, integrando tecnologías aplicadas e identidad territorial para mejorar la eficiencia de los procesos.'
  },
  {
    title: 'Software, Tecnologías de la Información y Ciencias de Datos',
    description:
      'Línea centrada en software, tecnologías de información y ciencia de datos para apoyar la toma de decisiones, modelar procesos y optimizar entornos productivos.'
  },
  {
    title: 'Energía, Desarrollo Sostenible y Gestión de Recursos Naturales',
    description:
      'Línea enfocada en energía, sostenibilidad y gestión eficiente de recursos naturales mediante soluciones tecnológicas de impacto ambiental y productivo.'
  }
];

const projectTitles = [
  'Modelo PROS50 para MIPYMES textiles sostenibles',
  'Sistema IoT para monitoreo energético industrial',
  'Gemelo digital para procesos de manufactura flexible',
  'Plataforma de analítica de datos para productividad académica',
  'Optimización de cadenas de suministro sostenibles',
  'Sistema de visión artificial para control de calidad',
  'Modelo predictivo para mantenimiento de maquinaria',
  'Evaluación de huella de carbono en procesos industriales',
  'Manufactura esbelta aplicada a pequeñas empresas',
  'Sistema inteligente para planificación de producción',
  'Blockchain para trazabilidad de productos industriales',
  'Robótica colaborativa para ambientes de manufactura',
  'Smart Factory Ecuador para Industria 4.0',
  'Modelo de sostenibilidad para gestión de recursos hídricos',
  'Machine Learning para predicción de demanda productiva',
  'Sistema de apoyo a decisiones para operaciones sostenibles',
  'Automatización de indicadores de eficiencia operativa',
  'Aplicación de Industria 5.0 en empresas manufactureras',
  'Modelo de innovación social para comunidades productivas',
  'Dashboard académico para seguimiento de investigación'
];

const publicationTitles = [
  'Sustainable decision-making model for textile SMEs',
  'IoT architecture for industrial energy monitoring',
  'Digital twins for flexible manufacturing environments',
  'Data analytics for academic productivity management',
  'Optimization of sustainable supply chains',
  'Computer vision for industrial quality control',
  'Predictive maintenance using machine learning models',
  'Carbon footprint assessment in manufacturing systems',
  'Lean manufacturing practices in small enterprises',
  'Production planning through intelligent systems',
  'Blockchain traceability in industrial supply chains',
  'Collaborative robotics for smart manufacturing',
  'Smart Factory framework for Ecuadorian industries',
  'Sustainable water resource management model',
  'Demand forecasting through artificial intelligence',
  'Decision support systems for sustainable operations',
  'Operational efficiency dashboards for manufacturing',
  'Industry 5.0 adoption in productive organizations',
  'Social innovation model for productive communities',
  'Research monitoring platform for academic groups',
  'Hybrid optimization model for production planning',
  'Artificial intelligence applied to industrial logistics',
  'Simulation model for resilient production systems',
  'Data-driven sustainability indicators in manufacturing',
  'Resource efficiency model for industrial operations',
  'Knowledge transfer model between university and industry',
  'Sustainable operations maturity model',
  'Advanced analytics for process improvement',
  'Environmental performance assessment in SMEs',
  'Digital transformation roadmap for production systems',
  'Machine learning model for process anomaly detection',
  'IoT-based monitoring for smart factories',
  'Industrial data governance for research groups',
  'Operations research applied to textile production',
  'Sustainable production indicators for local industry',
  'Optimization framework for circular economy processes',
  'Industry 4.0 readiness assessment in SMEs',
  'Multi-criteria decision model for sustainable projects',
  'Manufacturing resilience under uncertainty',
  'Technology adoption in academic research ecosystems'
];

const newsTitles = [
  'REASONS presenta nuevos proyectos de investigación aplicada',
  'Investigadores participan en congreso internacional de industria sostenible',
  'Nuevo artículo científico publicado en revista indexada',
  'Convenio académico fortalece la vinculación con el sector productivo',
  'Workshop sobre Industria 4.0 e inteligencia artificial aplicada',
  'REASONS impulsa investigación sobre sostenibilidad en MIPYMES',
  'Seminario sobre ciencia de datos para sistemas productivos',
  'Proyecto de eficiencia energética inicia fase de validación',
  'Docentes investigadores desarrollan modelo de trazabilidad industrial',
  'Grupo REASONS participa en jornada de innovación universitaria',
  'Nueva línea de trabajo integra IoT y manufactura inteligente',
  'Resultados preliminares de proyecto textil son presentados',
  'Capacitación sobre dashboards de investigación académica',
  'Investigación sobre huella de carbono avanza a etapa piloto',
  'REASONS fortalece cooperación entre academia, industria y comunidad',
  'Sistema de monitoreo productivo es probado en ambiente controlado',
  'Publicación sobre Industria 5.0 recibe reconocimiento académico',
  'Equipo investigador socializa avances de proyectos sostenibles',
  'Nueva propuesta de innovación social se integra al portafolio',
  'Plataforma web institucional mejora la divulgación científica'
];

async function seedOrganization(seed: {
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
  academicDomain: string;
  generalDescription: string;
  mission: string;
  vision: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  logoUrl: string;
  bannerUrl: string;
}, passwordHash: string) {
  const organization = await prisma.organization.upsert({
    where: {
      slug: seed.slug
    },
    update: {
      name: seed.name,
      primaryDomain: seed.primaryDomain,
      status: 'ACTIVE'
    },
    create: {
      name: seed.name,
      slug: seed.slug,
      primaryDomain: seed.primaryDomain,
      status: 'ACTIVE',
      siteSettings: {
        create: {
          institutionName: seed.institutionName,
          groupName: seed.groupName,
          acronym: seed.acronym,
          generalDescription: seed.generalDescription,
          mission: seed.mission,
          vision: seed.vision,
          academicDomain: seed.academicDomain,
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
          bannerTitle: `${seed.acronym}: investigación, sostenibilidad e innovación`,
          bannerSubtitle:
            'Portal académico para la divulgación de investigadores, líneas de investigación, proyectos, publicaciones y noticias.',
          contactButtonText: 'Contactar al equipo'
        }
      },
      aboutSettings: {
        create: {
          description: seed.generalDescription,
          generalObjective:
            'Desarrollar investigación aplicada e interdisciplinaria en ingeniería para promover operaciones que integren preservación de la naturaleza, innovación tecnológica y bienestar social.'
        }
      }
    }
  });

  const logo = await upsertMedia(
    organization.id,
    `seed-${seed.slug}-logo`,
    seed.logoUrl,
    `${seed.slug}-logo.webp`
  );

  const banner = await upsertMedia(
    organization.id,
    `seed-${seed.slug}-banner`,
    seed.bannerUrl,
    `${seed.slug}-banner.webp`
  );

  const portrait = await upsertMedia(
    organization.id,
    `seed-${seed.slug}-portrait`,
    'https://i.imgur.com/6VBx3io.jpeg',
    `${seed.slug}-portrait.webp`
  );

  const projectImage = await upsertMedia(
    organization.id,
    `seed-${seed.slug}-project`,
    'https://i.imgur.com/8Km9tLL.jpeg',
    `${seed.slug}-project.webp`
  );

  const coverImage = await upsertMedia(
    organization.id,
    `seed-${seed.slug}-publication-cover`,
    'https://i.imgur.com/GIP46xu.jpeg',
    `${seed.slug}-publication-cover.webp`
  );

  const siteSettings = await prisma.siteSettings.update({
    where: {
      organizationId: organization.id
    },
    data: {
      institutionName: seed.institutionName,
      groupName: seed.groupName,
      acronym: seed.acronym,
      generalDescription: seed.generalDescription,
      mission: seed.mission,
      vision: seed.vision,
      academicDomain: seed.academicDomain,
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
    where: {
      organizationId: organization.id
    },
    data: {
      bannerMediaId: banner.id
    }
  });

  await prisma.siteSocialLink.createMany({
    data: [
      {
        organizationId: organization.id,
        siteSettingsId: siteSettings.id,
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com',
        displayOrder: 1
      },
      {
        organizationId: organization.id,
        siteSettingsId: siteSettings.id,
        platform: 'ResearchGate',
        url: 'https://www.researchgate.net',
        displayOrder: 2
      },
      {
        organizationId: organization.id,
        siteSettingsId: siteSettings.id,
        platform: 'ORCID',
        url: 'https://orcid.org',
        displayOrder: 3
      },
      {
        organizationId: organization.id,
        siteSettingsId: siteSettings.id,
        platform: 'Facebook',
        url: 'https://www.facebook.com',
        displayOrder: 4
      }
    ],
    skipDuplicates: true
  });

  const aboutSettings = await prisma.aboutSettings.findUniqueOrThrow({
    where: {
      organizationId: organization.id
    }
  });

  const objectiveCount = await prisma.aboutObjective.count({
    where: {
      aboutSettingsId: aboutSettings.id
    }
  });

  if (objectiveCount === 0) {
    await prisma.aboutObjective.createMany({
      data: [
        {
          organizationId: organization.id,
          aboutSettingsId: aboutSettings.id,
          description:
            'Diseñar y optimizar procesos orientados a la eficiencia, el uso responsable de recursos y la reducción de impactos ambientales.',
          displayOrder: 1
        },
        {
          organizationId: organization.id,
          aboutSettingsId: aboutSettings.id,
          description:
            'Generar proyectos de investigación y vinculación que fortalezcan la relación entre academia, industria y comunidad.',
          displayOrder: 2
        },
        {
          organizationId: organization.id,
          aboutSettingsId: aboutSettings.id,
          description:
            'Formar profesionales e investigadores con visión ética, ambiental y social para impulsar el desarrollo sostenible.',
          displayOrder: 3
        }
      ]
    });
  }

  const contactChannels = [
    {
      type: 'email',
      value: seed.email,
      label: 'Correo institucional',
      displayOrder: 1
    },
    {
      type: 'email',
      value: 'proyectos@uta.edu.ec',
      label: 'Correo de proyectos',
      displayOrder: 2
    },
    {
      type: 'email',
      value: 'investigacion@uta.edu.ec',
      label: 'Correo de investigación',
      displayOrder: 3
    },
    {
      type: 'address',
      value: seed.address,
      label: 'Dirección',
      displayOrder: 4
    },
    {
      type: 'phone',
      value: '+593 3 000 0000',
      label: 'Teléfono',
      displayOrder: 5
    }
  ];

  for (const channel of contactChannels) {
    const existingChannel = await prisma.contactChannel.findFirst({
      where: {
        organizationId: organization.id,
        type: channel.type,
        value: channel.value
      }
    });

    if (!existingChannel) {
      await prisma.contactChannel.create({
        data: {
          ...channel,
          organizationId: organization.id
        }
      });
    }
  }

  await prisma.admin.upsert({
    where: {
      email: seed.adminEmail
    },
    update: {
      organizationId: organization.id,
      fullName: seed.adminName,
      passwordHash,
      role: 'ORG_ADMIN',
      isActive: true
    },
    create: {
      organizationId: organization.id,
      fullName: seed.adminName,
      email: seed.adminEmail,
      passwordHash,
      role: 'ORG_ADMIN'
    }
  });

  const lineRecords = [];

  for (let i = 0; i < researchLines.length; i++) {
    const line = await upsertResearchLine(
      organization.id,
      researchLines[i].title,
      researchLines[i].description,
      ContentStatus.PUBLISHED,
      i + 1
    );

    lineRecords.push(line);
  }

  await upsertResearchLine(
    organization.id,
    'Línea en evaluación interna',
    'Línea de prueba en estado borrador para validar que no aparece en vistas públicas.',
    ContentStatus.DRAFT,
    98
  );

  await upsertResearchLine(
    organization.id,
    'Línea archivada de prueba',
    'Línea oculta para validar filtros de estado y administración de contenido.',
    ContentStatus.HIDDEN,
    99
  );

  const researcherRecords = [];

  for (let i = 0; i < reasonsResearchers.length; i++) {
    const researcher = await upsertResearcher(organization.id, {
      ...reasonsResearchers[i],
      photoMediaId: portrait.id,
      status: i < 10 ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
      displayOrder: i + 1,
      isFeatured: i < 4
    });

    researcherRecords.push(researcher);
  }

  const authors = [];

  for (const researcher of researcherRecords) {
    const author = await upsertAuthor(
      organization.id,
      researcher.fullName,
      researcher.orcid ?? `orcid-${researcher.id}`,
      researcher.id
    );

    authors.push(author);
  }

  const projectRecords = [];

  for (let i = 0; i < projectTitles.length; i++) {
    const status = statusCycle[i % statusCycle.length];
    const projectStatus = projectStatusCycle[i % projectStatusCycle.length];

    const project = await upsertProject(organization.id, {
      title: projectTitles[i],
      slug: slugify(projectTitles[i]),
      description:
        'Proyecto orientado a la generación de soluciones aplicadas en ingeniería, sostenibilidad, tecnología y optimización de sistemas productivos.',
      objectives:
        'Diseñar, implementar y evaluar una solución basada en herramientas de ingeniería, análisis de datos y tecnologías aplicadas para mejorar procesos productivos y fortalecer la toma de decisiones.',
      results:
        status === ContentStatus.PUBLISHED
          ? 'Se obtuvieron resultados preliminares favorables, incluyendo indicadores de eficiencia, prototipos funcionales, documentación técnica y posibilidades de transferencia al sector productivo.'
          : 'Resultados en proceso de revisión interna por el equipo de investigación.',
      mainMediaId: projectImage.id,
      status,
      projectStatus,
      displayOrder: i + 1,
      isFeatured: i < 6 && status === ContentStatus.PUBLISHED
    });

    projectRecords.push(project);

    await linkProjectResearchLine(
      organization.id,
      project.id,
      lineRecords[i % lineRecords.length].id
    );

    const principal = researcherRecords[i % researcherRecords.length];
    const coauthorA = researcherRecords[(i + 2) % researcherRecords.length];
    const coauthorB = researcherRecords[(i + 5) % researcherRecords.length];

    await linkProjectResearcher(
      organization.id,
      project.id,
      principal.id,
      'Investigador principal'
    );

    await linkProjectResearcher(
      organization.id,
      project.id,
      coauthorA.id,
      'Coinvestigador'
    );

    await linkProjectResearcher(
      organization.id,
      project.id,
      coauthorB.id,
      'Colaborador'
    );
  }

  for (let i = 0; i < publicationTitles.length; i++) {
    const project = projectRecords[i % projectRecords.length];
    const status = statusCycle[i % statusCycle.length];

    const selectedAuthors = [
      authors[i % authors.length].id,
      authors[(i + 1) % authors.length].id,
      authors[(i + 3) % authors.length].id
    ];

    await upsertPublication(organization.id, {
      projectId: project.id,
      coverMediaId: coverImage.id,
      title: publicationTitles[i],
      slug: slugify(publicationTitles[i]),
      abstract:
        'Este artículo presenta un estudio aplicado relacionado con sostenibilidad, tecnologías de información, optimización, ciencia de datos y sistemas productivos. La investigación propone un enfoque metodológico para mejorar la toma de decisiones y fortalecer la transferencia de conocimiento entre universidad, industria y sociedad.',
      citation: `${publicationTitles[i]}. Journal of Sustainable Engineering and Operations, ${
        2021 + (i % 6)
      }.`,
      doi: `10.59300/reasons.${2021 + (i % 6)}.${String(i + 1).padStart(
        3,
        '0'
      )}`,
      status,
      displayOrder: i + 1,
      publishedAt: new Date(
        `${2021 + (i % 6)}-${String((i % 12) + 1).padStart(2, '0')}-15`
      ),
      authorIds: selectedAuthors
    });
  }

  for (let i = 0; i < newsTitles.length; i++) {
    const status = statusCycle[i % statusCycle.length];
    const project = projectRecords[i % projectRecords.length];

    await upsertNews(organization.id, {
      projectId: project.id,
      mainMediaId: projectImage.id,
      title: newsTitles[i],
      slug: slugify(newsTitles[i]),
      summary:
        'Actividad académica vinculada con investigación aplicada, innovación, sostenibilidad y fortalecimiento institucional.',
      content:
        'El grupo de investigación desarrolla actividades orientadas a la generación de conocimiento aplicado, la vinculación con el sector productivo y la divulgación de resultados científicos. Esta noticia permite probar listados, estados, destacados, relaciones con proyectos, fechas de publicación y visualización pública.',
      status,
      displayOrder: i + 1,
      publishedAt: new Date(
        `2026-${String((i % 12) + 1).padStart(2, '0')}-${String(
          (i % 25) + 1
        ).padStart(2, '0')}`
      )
    });
  }

  return organization;
}

async function main() {
  const passwordHash = await argon2.hash(defaultPassword);

  await seedOrganization(
    {
      name: 'Universidad Técnica de Ambato - REASONS',
      slug: 'uta-reasons',
      primaryDomain: 'reasons.localhost',
      adminEmail: 'admin@uta.edu.ec',
      adminName: 'Administrador REASONS',
      institutionName: 'Universidad Técnica de Ambato',
      groupName: 'REASONS Research Hub',
      acronym: 'REASONS',
      email: 'reasons@uta.edu.ec',
      address:
        'Av. de Los Chasquis y Av. Río Payamino. Facultad de Ingeniería en Sistemas, Electrónica e Industrial. Universidad Técnica de Ambato. Ambato - Ecuador.',
      academicDomain:
        'Optimización de los Sistemas Productivos, Diseño y Desarrollo Urbanístico de la Facultad de Ingeniería en Sistemas, Electrónica e Industrial',
      generalDescription:
        'REASONS es un grupo de investigación de la Universidad Técnica de Ambato que impulsa soluciones innovadoras en ingeniería con enfoque de sostenibilidad y compromiso social. Sus líneas de trabajo abarcan operaciones industriales, tecnologías limpias, gestión eficiente de recursos, innovación social y diseño de sistemas resilientes frente al cambio climático.',
      mission:
        'Impulsar investigación aplicada e interdisciplinaria en ingeniería para fortalecer la sostenibilidad, la innovación tecnológica y el bienestar de la sociedad.',
      vision:
        'Consolidarse como un referente académico que conecta ciencia, sociedad y naturaleza en la construcción de soluciones sostenibles.',
      colors: {
        primary: '#00346f',
        secondary: '#006688',
        background: '#f7f9ff',
        surface: '#ffffff',
        text: '#111c2d'
      },
      logoUrl: 'https://i.imgur.com/RARaC9j.png',
      bannerUrl: 'https://i.imgur.com/GIP46xu.jpeg'
    },
    passwordHash
  );

  await prisma.admin.upsert({
    where: {
      email: 'superadmin@reasons.local'
    },
    update: {
      fullName: 'Super Administrador',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true
    },
    create: {
      organizationId: null,
      fullName: 'Super Administrador',
      email: 'superadmin@reasons.local',
      passwordHash,
      role: 'SUPER_ADMIN'
    }
  });

  console.log('Seed completado correctamente.');
  console.log('ORG_ADMIN: admin@uta.edu.ec');
  console.log('SUPER_ADMIN: superadmin@reasons.local');
  console.log(`Password: ${defaultPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });