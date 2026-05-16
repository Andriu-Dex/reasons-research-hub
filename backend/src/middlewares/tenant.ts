import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../shared/http-error.js';

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
