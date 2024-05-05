import { z } from 'zod';

export const betsSummaryParamsSchema = z.object({
  wallet: z.string().startsWith('0x').optional(),
});
