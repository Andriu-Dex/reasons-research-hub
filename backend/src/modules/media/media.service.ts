import axios from 'axios';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { env } from '../../config/env.js';
import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../shared/http-error.js';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxFileSizeBytes = 2 * 1024 * 1024;

export class MediaService {
  async upload(organizationId: string, file?: Express.Multer.File) {
    if (!file) throw new HttpError(400, 'Debe seleccionar una imagen.');
    if (!allowedMimeTypes.has(file.mimetype)) throw new HttpError(400, 'Formato de imagen no permitido.');
    if (file.size > maxFileSizeBytes) throw new HttpError(400, 'La imagen supera el tamano maximo permitido.');

    const webpBuffer = await sharp(file.buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    if (env.IMGUR_MOCK || !env.IMGUR_CLIENT_ID) {
      return prisma.mediaFile.create({
        data: {
          organizationId,
          url: `mock://imgur/${crypto.randomUUID()}.webp`,
          originalFilename: file.originalname,
          mimeType: 'image/webp',
          fileSizeBytes: webpBuffer.length
        }
      });
    }

    const response = await axios.post('https://api.imgur.com/3/image', webpBuffer.toString('base64'), {
      headers: {
        Authorization: `Client-ID ${env.IMGUR_CLIENT_ID}`,
        'Content-Type': 'text/plain'
      }
    });

    return prisma.mediaFile.create({
      data: {
        organizationId,
        imgurId: response.data.data.id,
        url: response.data.data.link,
        deleteHash: response.data.data.deletehash,
        originalFilename: file.originalname,
        mimeType: 'image/webp',
        fileSizeBytes: webpBuffer.length
      }
    });
  }

  async list(organizationId: string) {
    return prisma.mediaFile.findMany({
      where: { organizationId },
      orderBy: { uploadedAt: 'desc' }
    });
  }

  async remove(organizationId: string, id: string) {
    const file = await prisma.mediaFile.findFirst({ where: { id, organizationId } });
    if (!file) throw new HttpError(404, 'Archivo no encontrado.');
    await prisma.mediaFile.delete({ where: { id } });
  }
}

export const mediaService = new MediaService();
