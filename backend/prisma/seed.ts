import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('Admin12345!');

  const organization = await prisma.organization.upsert({
    where: { slug: 'uta-reasons' },
    update: {},
    create: {
      name: 'Universidad Tecnica de Ambato - REASONS',
      slug: 'uta-reasons',
      siteSettings: {
        create: {
          institutionName: 'Universidad Tecnica de Ambato',
          groupName: 'REASONS Research Hub',
          acronym: 'REASONS',
          generalDescription:
            'Plataforma academica para la gestion y divulgacion de investigacion, proyectos, publicaciones y actividades del grupo REASONS.',
          mission:
            'Impulsar investigacion aplicada y colaborativa con impacto academico, tecnologico y social.',
          vision:
            'Ser un referente regional en investigacion interdisciplinaria, innovacion y transferencia de conocimiento.',
          academicDomain: 'Investigacion, tecnologia e innovacion academica',
          institutionalEmail: 'reasons@uta.edu.ec',
          address: 'Ambato, Tungurahua, Ecuador',
          footerText: 'Universidad Tecnica de Ambato - REASONS Research Hub',
          colorPrimary: '#0f766e',
          colorSecondary: '#164e63',
          colorBackground: '#f6f8f9',
          colorSurface: '#ffffff',
          colorText: '#172026',
        }
      },
      homeSettings: {
        create: {
          bannerTitle: 'Investigacion que conecta conocimiento, tecnologia y sociedad',
          bannerSubtitle:
            'Gestiona y explora investigadores, lineas, proyectos, publicaciones y noticias academicas desde un entorno dinamico.',
          contactButtonText: 'Contactar al grupo'
        }
      },
      aboutSettings: {
        create: {
          description:
            'REASONS es un espacio academico orientado a fortalecer la investigacion, la colaboracion y la publicacion cientifica.',
          generalObjective:
            'Consolidar una plataforma institucional para organizar y difundir produccion investigativa de forma clara, segura y escalable.',
        }
      },
      contactChannels: {
        create: [
          { type: 'email', value: 'reasons@uta.edu.ec', label: 'Correo institucional', displayOrder: 1 },
          { type: 'address', value: 'Ambato, Tungurahua, Ecuador', label: 'Direccion', displayOrder: 2 }
        ]
      }
    }
  });

  const siteSettings = await prisma.siteSettings.findUniqueOrThrow({ where: { organizationId: organization.id } });
  await prisma.siteSocialLink.createMany({
    data: [
      {
        organizationId: organization.id,
        siteSettingsId: siteSettings.id,
        platform: 'Facebook',
        url: 'https://www.facebook.com/UniversidadTecnicadeAmbato',
        displayOrder: 1
      },
      {
        organizationId: organization.id,
        siteSettingsId: siteSettings.id,
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/school/universidad-tecnica-de-ambato/',
        displayOrder: 2
      }
    ],
    skipDuplicates: true
  });

  const aboutSettings = await prisma.aboutSettings.findUniqueOrThrow({ where: { organizationId: organization.id } });
  if ((await prisma.aboutObjective.count({ where: { aboutSettingsId: aboutSettings.id } })) === 0) {
    await prisma.aboutObjective.createMany({
      data: [
        { organizationId: organization.id, aboutSettingsId: aboutSettings.id, description: 'Centralizar la informacion academica del grupo.', displayOrder: 1 },
        { organizationId: organization.id, aboutSettingsId: aboutSettings.id, description: 'Visibilizar proyectos, investigadores y publicaciones.', displayOrder: 2 },
        { organizationId: organization.id, aboutSettingsId: aboutSettings.id, description: 'Facilitar la administracion dinamica del portal.', displayOrder: 3 }
      ]
    });
  }

  await prisma.admin.upsert({
    where: { email: 'admin@uta.edu.ec' },
    update: {},
    create: {
      organizationId: organization.id,
      fullName: 'Administrador REASONS',
      email: 'admin@uta.edu.ec',
      passwordHash,
      role: 'ORG_ADMIN'
    }
  });

  await prisma.admin.upsert({
    where: { email: 'superadmin@reasons.local' },
    update: {},
    create: {
      organizationId: null,
      fullName: 'Super Administrador',
      email: 'superadmin@reasons.local',
      passwordHash,
      role: 'SUPER_ADMIN'
    }
  });

  const researchLine = await prisma.researchLine.upsert({
    where: { organizationId_title: { organizationId: organization.id, title: 'Tecnologias inteligentes aplicadas' } },
    update: {},
    create: {
      organizationId: organization.id,
      title: 'Tecnologias inteligentes aplicadas',
      description:
        'Linea orientada al uso de software, datos e inteligencia artificial para resolver problemas academicos y sociales.',
      icon: 'BrainCircuit',
      status: 'PUBLISHED',
      displayOrder: 1
    }
  });

  const researcher = await prisma.researcher.upsert({
    where: { organizationId_institutionalEmail: { organizationId: organization.id, institutionalEmail: 'investigador@uta.edu.ec' } },
    update: {},
    create: {
      organizationId: organization.id,
      fullName: 'Investigador Principal',
      position: 'Docente investigador',
      biography:
        'Perfil academico de prueba para validar la visualizacion de investigadores destacados y relaciones con proyectos.',
      institutionalEmail: 'investigador@uta.edu.ec',
      orcid: '0000-0000-0000-0001',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 1
    }
  });

  const project = await prisma.project.upsert({
    where: { organizationId_slug: { organizationId: organization.id, slug: 'plataforma-investigacion-dinamica' } },
    update: {},
    create: {
      organizationId: organization.id,
      title: 'Plataforma dinamica para gestion de investigacion',
      slug: 'plataforma-investigacion-dinamica',
      description:
        'Proyecto de referencia para validar la arquitectura multi-tenant, la gestion de contenidos y la divulgacion academica.',
      objectives:
        'Disenar e implementar una plataforma adaptable para grupos de investigacion, laboratorios e instituciones academicas.',
      results: 'Modelo inicial, portal publico y panel administrativo en desarrollo.',
      projectStatus: 'IN_PROGRESS',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 1,
      researchers: {
        create: [{ organizationId: organization.id, researcherId: researcher.id, role: 'Director' }]
      },
      researchLines: {
        create: [{ organizationId: organization.id, researchLineId: researchLine.id }]
      }
    }
  });

  const author = await prisma.author.upsert({
    where: { organizationId_orcid: { organizationId: organization.id, orcid: '0000-0000-0000-0001' } },
    update: {},
    create: {
      organizationId: organization.id,
      researcherId: researcher.id,
      fullName: researcher.fullName,
      orcid: researcher.orcid
    }
  });

  await prisma.publication.upsert({
    where: { organizationId_slug: { organizationId: organization.id, slug: 'arquitectura-multitenant-investigacion' } },
    update: {},
    create: {
      organizationId: organization.id,
      title: 'Arquitectura multi-tenant para portales de investigacion',
      slug: 'arquitectura-multitenant-investigacion',
      abstract:
        'Publicacion de prueba sobre el diseno de sistemas academicos configurables y escalables.',
      citation:
        'Investigador Principal. (2026). Arquitectura multi-tenant para portales de investigacion.',
      projectId: project.id,
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 1,
      publishedAt: new Date('2026-01-15'),
      authors: {
        create: [{ authorId: author.id, authorOrder: 1 }]
      }
    }
  });

  await prisma.news.upsert({
    where: { organizationId_slug: { organizationId: organization.id, slug: 'inicio-plataforma-reasons' } },
    update: {},
    create: {
      organizationId: organization.id,
      title: 'Inicio del portal REASONS Research Hub',
      slug: 'inicio-plataforma-reasons',
      summary: 'Se inicia la implementacion de una plataforma dinamica para investigacion academica.',
      content:
        'La plataforma permitira gestionar informacion institucional, investigadores, lineas, proyectos, publicaciones y noticias desde un panel seguro.',
      publishedAt: new Date('2026-05-15'),
      projectId: project.id,
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 1
    }
  });

  console.log('Seed completed. Admin password: Admin12345!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
