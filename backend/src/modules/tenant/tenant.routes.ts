import { Router } from 'express';
import { resolveCurrentTenantByHost } from '../../middlewares/tenant.js';
import { asyncHandler } from '../../shared/async-handler.js';
import { HttpError } from '../../shared/http-error.js';

export const tenantRouter = Router();

tenantRouter.get('/current', asyncHandler(async (request, response) => {
  const organization = await resolveCurrentTenantByHost(request.headers.host);
  if (!organization) {
    throw new HttpError(404, 'No se pudo resolver una organizacion activa para este dominio.');
  }
  response.json(organization);
}));
