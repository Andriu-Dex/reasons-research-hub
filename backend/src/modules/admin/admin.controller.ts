import type { Request, Response } from 'express';
import { HttpError } from '../../shared/http-error.js';
import { adminService } from './admin.service.js';

function organizationIdFrom(request: Request) {
  const organizationId = request.admin?.organizationId;
  if (!organizationId) throw new HttpError(403, 'No tiene una organizacion asignada.');
  return organizationId;
}

export class AdminController {
  async list(request: Request, response: Response) {
    response.json(await adminService.list(String(request.params.resource), organizationIdFrom(request)));
  }

  async get(request: Request, response: Response) {
    response.json(await adminService.get(String(request.params.resource), String(request.params.id), organizationIdFrom(request)));
  }

  async create(request: Request, response: Response) {
    response.status(201).json(await adminService.create(String(request.params.resource), organizationIdFrom(request), request.body));
  }

  async update(request: Request, response: Response) {
    response.json(await adminService.update(String(request.params.resource), String(request.params.id), organizationIdFrom(request), request.body));
  }

  async remove(request: Request, response: Response) {
    await adminService.remove(String(request.params.resource), String(request.params.id), organizationIdFrom(request));
    response.status(204).send();
  }

  async getSiteSettings(request: Request, response: Response) {
    response.json(await adminService.getSiteSettings(organizationIdFrom(request)));
  }

  async updateSiteSettings(request: Request, response: Response) {
    response.json(await adminService.updateSiteSettings(organizationIdFrom(request), request.body));
  }

  async getHomeSettings(request: Request, response: Response) {
    response.json(await adminService.getHomeSettings(organizationIdFrom(request)));
  }

  async updateHomeSettings(request: Request, response: Response) {
    response.json(await adminService.updateHomeSettings(organizationIdFrom(request), request.body));
  }

  async getAboutSettings(request: Request, response: Response) {
    response.json(await adminService.getAboutSettings(organizationIdFrom(request)));
  }

  async updateAboutSettings(request: Request, response: Response) {
    response.json(await adminService.updateAboutSettings(organizationIdFrom(request), request.body));
  }

  async listOrganizations(_request: Request, response: Response) {
    response.json(await adminService.listOrganizations());
  }

  async createOrganization(request: Request, response: Response) {
    response.status(201).json(await adminService.createOrganization(request.body));
  }

  async updateOrganization(request: Request, response: Response) {
    response.json(await adminService.updateOrganization(String(request.params.id), request.body));
  }
}

export const adminController = new AdminController();
