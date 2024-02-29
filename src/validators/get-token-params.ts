import { z } from 'zod';

export const getTokenParamsSchema = z.object({
  token: z.string(),
  coin: z.string(),
});
