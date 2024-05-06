import { z } from 'zod';

export const listBetsParamsSchema = z.object({
  page: z.coerce.number().min(1),
  pageSize: z.coerce.number().min(5).max(25),
  order: z.record(z.string(), z.enum(['ASC', 'DESC'])).optional(),
  status: z
    .array(z.enum(['initiated', 'approved', 'closed', 'settled', 'voided']))
    .optional(),
  wallet: z.string().startsWith('0x').optional(),
});
