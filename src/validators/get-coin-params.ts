import { z } from 'zod';

export const getCoinParamsSchema = z.object({
  coin: z.string(),
});
