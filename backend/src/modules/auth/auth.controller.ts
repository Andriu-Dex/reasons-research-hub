import type { Request, Response } from 'express';
import { env } from '../../config/env.js';
import { authService } from './auth.service.js';

const refreshCookieName = 'reasons_refresh_token';

function setRefreshCookie(response: Response, token: string, expiresAt: Date) {
  response.cookie(refreshCookieName, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/api/auth'
  });
}

export class AuthController {
  async login(request: Request, response: Response) {
    const result = await authService.login(request.body.email, request.body.password);
    setRefreshCookie(response, result.refreshToken.token, result.refreshToken.expiresAt);
    response.json({
      accessToken: result.accessToken,
      admin: result.admin
    });
  }

  async refresh(request: Request, response: Response) {
    const token = request.cookies?.[refreshCookieName];
    const result = await authService.refresh(token);
    setRefreshCookie(response, result.refreshToken.token, result.refreshToken.expiresAt);
    response.json({ accessToken: result.accessToken });
  }

  async logout(request: Request, response: Response) {
    await authService.logout(request.cookies?.[refreshCookieName]);
    response.clearCookie(refreshCookieName, { path: '/api/auth' });
    response.status(204).send();
  }
}

export const authController = new AuthController();
