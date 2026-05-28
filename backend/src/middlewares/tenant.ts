import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../shared/http-error.js';

function normalizeHost(host?: string) {
  return host?.split(':')[0]?.trim().toLowerCase() ?? '';
}

async function findActiveOrganizationByHost(host?: string) {
  const normalizedHost = normalizeHost(host);
  if (!normalizedHost || normalizedHost === 'localhost' || normalizedHost === '127.0.0.1') {
    return null;
  }

  return prisma.organization.findFirst({
    where: { primaryDomain: normalizedHost, status: 'ACTIVE' },
    select: { id: true, slug: true, name: true, primaryDomain: true }
  });
}

export const resolveTenant: RequestHandler = async (request, _response, next) => {
  const tenantSlug = String(request.params.tenantSlug);

  if (!tenantSlug) {
    next(new HttpError(400, 'No se pudo resolver la organizacion.'));
    return;
  }

  const organization = await prisma.organization.findFirst({
    where: { slug: tenantSlug, status: 'ACTIVE' },
    select: { id: true, slug: true }
  });

  if (!organization) {
    next(new HttpError(404, 'La organizacion solicitada no existe o no esta activa.'));
    return;
  }

  request.tenant = organization;
  next();
};

export async function resolveCurrentTenantByHost(host?: string) {
  return findActiveOrganizationByHost(host);
}

export const resolveCurrentTenant: RequestHandler = async (request, response, next) => {
  const organization = await findActiveOrganizationByHost(request.headers.host);

  if (!organization) {
    next(new HttpError(404, 'No se pudo resolver una organizacion activa para este dominio.'));
    return;
  }

  response.json(organization);
};
