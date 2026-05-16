import type { Request, Response } from 'express';
import { mediaService } from './media.service.js';
import { HttpError } from '../../shared/http-error.js';

function organizationIdFrom(request: Request) {
  const organizationId = request.admin?.organizationId;
  if (!organizationId) throw new HttpError(403, 'No tiene una organizacion asignada.');
  return organizationId;
}

export class MediaController {
  async list(request: Request, response: Response) {
    response.json(await mediaService.list(organizationIdFrom(request)));
  }

  async upload(request: Request, response: Response) {
    response.status(201).json(await mediaService.upload(organizationIdFrom(request), request.file));
  }

  async remove(request: Request, response: Response) {
    await mediaService.remove(organizationIdFrom(request), String(request.params.id));
    response.status(204).send();
  }
}

export const mediaController = new MediaController();
