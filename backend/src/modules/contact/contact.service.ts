import axios from 'axios';
import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../shared/http-error.js';
import type { ContactMessageInput } from './contact.schema.js';

export class ContactService {
  async sendMessage(organizationId: string, input: ContactMessageInput) {
    await this.verifyTurnstile(input.turnstileToken);

    const settings = await prisma.siteSettings.findUnique({
      where: { organizationId },
      select: { institutionalEmail: true, groupName: true }
    });

    if (env.SMTP_MOCK) {
      console.info('Mock contact message', { organizationId, input });
      return;
    }

    if (!settings?.institutionalEmail) {
      throw new HttpError(400, 'La organizacion no tiene correo institucional configurado.');
    }

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
    });

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: settings.institutionalEmail,
      replyTo: input.email,
      subject: `[${settings.groupName}] ${input.subject}`,
      text: `Nombre: ${input.name}\nCorreo: ${input.email}\n\n${input.message}`
    });
  }

  private async verifyTurnstile(token?: string) {
    if (env.TURNSTILE_MOCK) return;

    if (!token) {
      throw new HttpError(400, 'Debe completar la verificacion antispam.');
    }

    const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', undefined, {
      params: {
        secret: env.TURNSTILE_SECRET_KEY,
        response: token
      }
    });

    if (!response.data.success) {
      throw new HttpError(400, 'La verificacion antispam no fue valida.');
    }
  }
}

export const contactService = new ContactService();
