import { Router } from 'express';
import multer from 'multer';
import { authenticateAdmin, requireTenantAdmin } from '../../middlewares/auth.js';
import { asyncHandler } from '../../shared/async-handler.js';
import { mediaController } from './media.controller.js';

const upload = multer({ storage: multer.memoryStorage() });

export const mediaRouter = Router();

mediaRouter.use(authenticateAdmin, requireTenantAdmin());
mediaRouter.get('/', asyncHandler(mediaController.list));
mediaRouter.post('/upload', upload.single('file'), asyncHandler(mediaController.upload));
mediaRouter.delete('/:id', asyncHandler(mediaController.remove));
