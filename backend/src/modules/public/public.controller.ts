import type { Request, Response } from 'express';
import { publicService } from './public.service.js';
import { HttpError } from '../../shared/http-error.js';
import { contactService } from '../contact/contact.service.js';

function getTenantId(request: Request) {
  if (!request.tenant?.id) throw new HttpError(400, 'No se pudo resolver la organizacion.');
  return request.tenant.id;
}

export class PublicController {
  async siteSettings(request: Request, response: Response) {
    response.json(await publicService.getSiteSettings(getTenantId(request)));
  }

  async home(request: Request, response: Response) {
    response.json(await publicService.getHome(getTenantId(request)));
  }

  async about(request: Request, response: Response) {
    response.json(await publicService.getAbout(getTenantId(request)));
  }

  async researchLines(request: Request, response: Response) {
    response.json(await publicService.getResearchLines(getTenantId(request)));
  }

  async researchers(request: Request, response: Response) {
    response.json(await publicService.getResearchers(getTenantId(request)));
  }

  async projects(request: Request, response: Response) {
    response.json(await publicService.getProjects(getTenantId(request)));
  }

  async publications(request: Request, response: Response) {
    response.json(await publicService.getPublications(getTenantId(request)));
  }

  async news(request: Request, response: Response) {
    response.json(await publicService.getNews(getTenantId(request)));
  }

  async contactChannels(request: Request, response: Response) {
    response.json(await publicService.getContactChannels(getTenantId(request)));
  }

  async contact(request: Request, response: Response) {
    await contactService.sendMessage(getTenantId(request), request.body);
    response.status(202).json({ message: 'Mensaje enviado correctamente.' });
  }
}

export const publicController = new PublicController();
