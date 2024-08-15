import { z } from 'zod';

export const getBetParamsSchema = z.object({
  id: z.string().uuid(),
});
