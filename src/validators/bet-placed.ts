import { z } from 'zod';
import { ethers } from 'ethers';

import { sanitizeHtml } from '@/middlewares/sanitize-html.middleware';

export const betPlacedDataSchema = z
  .object({
    initiator: z.string().startsWith('0x'),
    address: z.string().startsWith('0x'),
    betType: z.coerce.string(),
    betIndex: z.coerce.number().positive(),
    duration: z.coerce.number(),
    wager: z.bigint(),
    value: z.bigint(),
    auxiliaryValue: z.coerce.number(),
    option: z.string().transform((value) => ethers.decodeBytes32String(value)),
    wageringStyle: z.coerce.string(),
    startDateTime: z.coerce
      .number()
      .transform((value) => new Date(value * 1000)),
  })
  .transform((data) => sanitizeHtml(data));

export type BetPlacedData = z.infer<typeof betPlacedDataSchema>;
