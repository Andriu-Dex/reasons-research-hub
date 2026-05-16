import argon2 from 'argon2';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../shared/http-error.js';

type TokenAdmin = {
  id: string;
  organizationId: string | null;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN';
};

function signAccessToken(admin: TokenAdmin) {
  return jwt.sign(
    {
      organizationId: admin.organizationId,
      role: admin.role
    },
    env.JWT_ACCESS_SECRET,
    {
      subject: admin.id,
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
    } as jwt.SignOptions
  );
}

async function createRefreshToken(admin: TokenAdmin) {
  const token = crypto.randomBytes(64).toString('hex');
  const tokenHash = await argon2.hash(token);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      adminId: admin.id,
      tokenHash,
      expiresAt
    }
  });

  return { token, expiresAt };
}

export class AuthService {
  async login(email: string, password: string) {
    const admin = await prisma.admin.findUnique({
      where: { email },
      include: { organization: { select: { slug: true, name: true } } }
    });

    if (!admin?.isActive || !(await argon2.verify(admin.passwordHash, password))) {
      throw new HttpError(401, 'Credenciales incorrectas.');
    }

    const accessToken = signAccessToken(admin);
    const refreshToken = await createRefreshToken(admin);

    return {
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        organizationId: admin.organizationId,
        organizationSlug: admin.organization?.slug ?? null,
        organizationName: admin.organization?.name ?? null
      }
    };
  }

  async refresh(refreshToken: string) {
    const tokens = await prisma.refreshToken.findMany({
      where: {
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: { admin: true }
    });

    for (const storedToken of tokens) {
      if (await argon2.verify(storedToken.tokenHash, refreshToken)) {
        await prisma.refreshToken.update({
          where: { id: storedToken.id },
          data: { revokedAt: new Date() }
        });

        if (!storedToken.admin.isActive) {
          throw new HttpError(401, 'La sesion no es valida.');
        }

        const accessToken = signAccessToken(storedToken.admin);
        const nextRefreshToken = await createRefreshToken(storedToken.admin);

        return { accessToken, refreshToken: nextRefreshToken };
      }
    }

    throw new HttpError(401, 'La sesion no es valida o expiro.');
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return;

    const tokens = await prisma.refreshToken.findMany({
      where: { revokedAt: null }
    });

    for (const storedToken of tokens) {
      if (await argon2.verify(storedToken.tokenHash, refreshToken)) {
        await prisma.refreshToken.update({
          where: { id: storedToken.id },
          data: { revokedAt: new Date() }
        });
        return;
      }
    }
  }
}

export const authService = new AuthService();
