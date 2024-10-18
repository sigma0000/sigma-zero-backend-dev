import { Router, type Request, type Response } from 'express';

import { UsersRepository } from '@/db/repositories';

import { getUserParamsSchema } from '@/validators/get-user-params';
import { BetStatuses } from '@/db/enums';
import { formatEther } from 'ethers';

const userRoutes = Router();

userRoutes.get(
  '/:id',
  async (request: Request, response: Response) => {
    const params = getUserParamsSchema.safeParse(request.params);

    if (!params.success) {
      return response.status(400).json(params.error);
    }

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(params.data.id);

    if (!user) {
      return response.status(404).json({
        message: `User ${params.data.id} not found`,
      });
    }

    const correctBets = user.betEntries.filter(
      (betEntry) =>
        betEntry.betEntryResults.length &&
        betEntry.bet.status === BetStatuses.Settled &&
        betEntry.group === betEntry.betEntryResults[0].result.winnerGroup,
    );

    const userWithAdtionalInfo = {
      ...user,
      openedContracts: user.bets.length,
      correctCount: correctBets.length,
      earned: formatEther(
        BigInt(
          correctBets.reduce(
            (previous, current) =>
              previous + Number(current.betEntryResults[0].amountEth),
            0,
          ),
        ),
      ),
    };

    return response.json(userWithAdtionalInfo);
  },
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Get User Info'
    #swagger.responses[200] = {
      description: 'Success response from the user search.',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/listBetsResponse' 
            },
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Error response for invalid params',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/userNotFoundResponse' 
            },
          }
        }
      }
    }
  */
);

export { userRoutes };
