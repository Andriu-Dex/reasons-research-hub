import { Router } from 'express';
import { resolveTenant } from '../../middlewares/tenant.js';
import { validateBody } from '../../middlewares/validate.js';
import { asyncHandler } from '../../shared/async-handler.js';
import { contactMessageSchema } from '../contact/contact.schema.js';
import { publicController } from './public.controller.js';

export const publicRouter = Router({ mergeParams: true });

publicRouter.use(resolveTenant);
publicRouter.get('/site-settings', asyncHandler(publicController.siteSettings));
publicRouter.get('/home', asyncHandler(publicController.home));
publicRouter.get('/about', asyncHandler(publicController.about));
publicRouter.get('/research-lines', asyncHandler(publicController.researchLines));
publicRouter.get('/researchers', asyncHandler(publicController.researchers));
publicRouter.get('/projects', asyncHandler(publicController.projects));
publicRouter.get('/publications', asyncHandler(publicController.publications));
publicRouter.get('/news', asyncHandler(publicController.news));
publicRouter.get('/contact-channels', asyncHandler(publicController.contactChannels));
publicRouter.post('/contact', validateBody(contactMessageSchema), asyncHandler(publicController.contact));
