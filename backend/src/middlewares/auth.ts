import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../shared/http-error.js';

type AccessTokenPayload = {
  sub: string;
  organizationId: string | null;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN';
};

export const authenticateAdmin: RequestHandler = async (request, _response, next) => {
  const header = request.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    next(new HttpError(401, 'Debe iniciar sesion para continuar.'));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, organizationId: true, role: true, isActive: true }
    });

    if (!admin?.isActive) {
      next(new HttpError(401, 'La sesion no es valida.'));
      return;
    }

    request.admin = {
      id: admin.id,
      organizationId: admin.organizationId,
      role: admin.role
    };
    next();
  } catch {
    next(new HttpError(401, 'La sesion no es valida o expiro.'));
  }
};

export const requireSuperAdmin: RequestHandler = (request, _response, next) => {
  if (request.admin?.role !== 'SUPER_ADMIN') {
    next(new HttpError(403, 'No tiene permisos para realizar esta accion.'));
    return;
  }

  next();
};

export function requireTenantAdmin(): RequestHandler {
  return (request, _response, next) => {
    if (!request.admin?.organizationId) {
      next(new HttpError(403, 'No tiene una organizacion asignada.'));
      return;
    }

    next();
  };
}
