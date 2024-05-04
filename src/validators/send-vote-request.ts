import { z } from 'zod';

export const sendVoteRequestSchema = z.object({
  group: z.enum(['1', '2']),
  userWallet: z.string().startsWith('0x'),
  signature: z.string().startsWith('0x'),
  betId: z.string().uuid(),
});

export type SendVoteData = z.infer<typeof sendVoteRequestSchema>;
