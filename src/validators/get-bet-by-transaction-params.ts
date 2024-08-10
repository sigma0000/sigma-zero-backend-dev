import { z } from 'zod';

export const getBetByTransactionParamsSchema = z.object({
  hash: z.string().startsWith('0x'),
});
