import { Router } from 'express';
import { asyncHandler } from '../../shared/async-handler.js';
import { validateBody } from '../../middlewares/validate.js';
import { loginSchema } from './auth.schema.js';
import { authController } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), asyncHandler(authController.login));
authRouter.post('/refresh', asyncHandler(authController.refresh));
authRouter.post('/logout', asyncHandler(authController.logout));
