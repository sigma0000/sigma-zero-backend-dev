import { z } from 'zod';

export const getTokenParamsSchema = z.object({
  token: z.string().startsWith('0x'),
  coin: z.string(),
});
