import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(4000),
  turnstileToken: z.string().optional()
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
