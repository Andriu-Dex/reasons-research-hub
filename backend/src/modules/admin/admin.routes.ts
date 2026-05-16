import { Router } from 'express';
import { authenticateAdmin, requireSuperAdmin, requireTenantAdmin } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';
import { asyncHandler } from '../../shared/async-handler.js';
import {
  aboutSettingsSchema,
  authorSchema,
  contactChannelSchema,
  flexibleBodySchema,
  homeSettingsSchema,
  newsSchema,
  organizationSchema,
  projectSchema,
  publicationSchema,
  researcherSchema,
  researchLineSchema,
  siteSettingsSchema
} from './admin.schemas.js';
import { adminController } from './admin.controller.js';

const resourceSchemas: Record<string, { parse: (value: unknown) => unknown }> = {
  'contact-channels': contactChannelSchema,
  'research-lines': researchLineSchema,
  researchers: researcherSchema,
  projects: projectSchema,
  authors: authorSchema,
  publications: publicationSchema,
  news: newsSchema
};

function validateResourceBody() {
  return (request: any, response: any, next: any) => {
    const schema = resourceSchemas[String(request.params.resource)] ?? flexibleBodySchema;
    request.body = schema.parse(request.body);
    next();
  };
}

export const adminRouter = Router();

adminRouter.use(authenticateAdmin);

adminRouter.get('/organizations', requireSuperAdmin, asyncHandler(adminController.listOrganizations));
adminRouter.post('/organizations', requireSuperAdmin, validateBody(organizationSchema), asyncHandler(adminController.createOrganization));
adminRouter.put('/organizations/:id', requireSuperAdmin, validateBody(organizationSchema.partial()), asyncHandler(adminController.updateOrganization));

adminRouter.use(requireTenantAdmin());

adminRouter.get('/site-settings', asyncHandler(adminController.getSiteSettings));
adminRouter.put('/site-settings', validateBody(siteSettingsSchema), asyncHandler(adminController.updateSiteSettings));
adminRouter.get('/home-settings', asyncHandler(adminController.getHomeSettings));
adminRouter.put('/home-settings', validateBody(homeSettingsSchema), asyncHandler(adminController.updateHomeSettings));
adminRouter.get('/about-settings', asyncHandler(adminController.getAboutSettings));
adminRouter.put('/about-settings', validateBody(aboutSettingsSchema), asyncHandler(adminController.updateAboutSettings));

adminRouter.get('/:resource', asyncHandler(adminController.list));
adminRouter.post('/:resource', validateResourceBody(), asyncHandler(adminController.create));
adminRouter.get('/:resource/:id', asyncHandler(adminController.get));
adminRouter.put('/:resource/:id', validateResourceBody(), asyncHandler(adminController.update));
adminRouter.delete('/:resource/:id', asyncHandler(adminController.remove));
