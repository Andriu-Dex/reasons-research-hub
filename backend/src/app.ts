import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { mediaRouter } from './modules/media/media.routes.js';
import { publicRouter } from './modules/public/public.routes.js';
import { tenantRouter } from './modules/tenant/tenant.routes.js';
import { errorHandler } from './middlewares/error-handler.js';
import { notFoundHandler } from './middlewares/not-found.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', service: 'REASONS Research Hub API' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/tenant', tenantRouter);
  app.use('/api/admin/media', mediaRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/:tenantSlug', publicRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
