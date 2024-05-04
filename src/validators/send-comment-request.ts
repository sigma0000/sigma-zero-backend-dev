import { z } from 'zod';

import { sanitizeHtml } from '@/middlewares/sanitize-html.middleware';

export const sendCommentRequestSchema = z
  .object({
    text: z.string(),
    userWallet: z.string().startsWith('0x'),
    signature: z.string().startsWith('0x'),
    betId: z.string().uuid(),
  })
  .transform((data) => sanitizeHtml(data));

export type SendCommentData = z.infer<typeof sendCommentRequestSchema>;
