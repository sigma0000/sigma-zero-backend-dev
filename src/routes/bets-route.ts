import { Router, type Request, type Response } from 'express';

import {
  BetsRepository,
  CommentsRepository,
  UsersRepository,
} from '@/db/repositories';
import { listBetsParamsSchema } from '@/validators/list-bets-params';
import {
  getBetPrediction,
  getCompleteBetPrediction,
} from '@/helpers/get-bet-prediction';
import { getBetTimeLeft } from '@/helpers/get-bet-time-left';
import { betsSummaryParamsSchema } from '@/validators/bets-summary-params';
import { getBetParamsSchema } from '@/validators/get-bet-params';
import { getBetByTransactionParamsSchema } from '@/validators/get-bet-by-transaction-params';
import { sendCommentRequestSchema } from '@/validators/send-comment-request';
import { sendVoteRequestSchema } from '@/validators/send-vote-request';
import { verifyMessageMiddleware } from '@/middlewares/verify-message.middleware';
import { VotesRepository } from '@/db/repositories/votes-repository';
import { formatEther } from 'ethers';

const betsRoutes = Router();

betsRoutes.get(
  '/',
  async (request: Request, response: Response) => {
    const query = listBetsParamsSchema.safeParse(request.query);

    const betsRepository = new BetsRepository();

    if (!query.success) {
      return response.status(400).json(query.error);
    }

    const [bets, count] = await betsRepository.findAllWithPagination(
      query.data,
    );

    const betsWithAditionalInfo = bets.map((bet) => {
      const timeLeft = getBetTimeLeft(bet.status, bet.startDate, bet.duration);

      const isExpired = timeLeft === 'expired';

      return {
        ...bet,
        prediction: getBetPrediction(
          bet.betType,
          bet.value,
          bet.auxiliaryValue,
        ),
        status: isExpired ? 'expired' : bet.status,
        timeLeft: isExpired ? '-' : timeLeft,
        tvl:
          formatEther(
            bet.betEntries.reduce(
              (previous, current) =>
                BigInt(previous) + BigInt(current.amountEth),
              BigInt(0),
            ),
          ) || null,
      };
    });

    return response.json({
      data: betsWithAditionalInfo,
      pageCount: betsWithAditionalInfo.length,
      page: query.data.page,
      pageSize: query.data.pageSize,
      total: count,
    });
  },
  /*
    #swagger.tags = ['Bets']
    #swagger.summary = 'List all bets'
    #swagger.parameters['page'] = {
      in: 'query',
      description: 'Page the bets (min: 1)',
    }
    #swagger.parameters['pageSize'] = {
      in: 'query',
      description: 'Number of items per page (min: 5, max: 25)',
    }
    #swagger.parameters['wallet'] = {
      in: 'query',
      description: 'Wallet Address',
    }
    #swagger.parameters['status'] = {
      in: 'query',
      description: 'Status',
      type: 'array',
      schema: {
        '@enum': ['initiated', 'approved', 'closed', 'settled', 'voided']
      }
    }
    #swagger.parameters['order[index]'] = {
      in: 'query',
      description: 'Sorts the listing, within order[] any field of a bet can be inserted',
    }
    #swagger.responses[200] = {
      description: 'Success response from the bets search.',
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
    #swagger.responses[400] = {
      description: 'Error response for invalid params',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/invalidQueryParamsListBetsResponse' 
            },
          }
        }
      }
    }
  */
);

betsRoutes.get(
  '/summary',
  async (request: Request, response: Response) => {
    const query = betsSummaryParamsSchema.safeParse(request.query);

    if (!query.success) {
      return response.status(400).json(query.error);
    }

    const betsRepository = new BetsRepository();
    const [valueLockedData, activeBetsData] = await Promise.all([
      betsRepository.findTVLBetsInLastYear(query.data),
      betsRepository.findActiveBetsInLastYear(query.data),
    ]);

    const data = {
      activeBets: {
        data: activeBetsData,
        total: activeBetsData.reduce(
          (previous, current) => previous + Number(current.count),
          0,
        ),
      },
      valueLocked: {
        data: valueLockedData,
        total: formatEther(
          BigInt(
            valueLockedData.reduce(
              (previous, current) => previous + Number(current.totalValue),
              0,
            ),
          ),
        ),
      },
    };

    return response.json(data);
  },
  /*
    #swagger.tags = ['Bets']
    #swagger.summary = 'List all bets'
    #swagger.parameters['wallet'] = {
      in: 'query',
      description: 'Wallet Address',
    }
    #swagger.responses[200] = {
      description: 'Success response from the bets summary search.',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/betsSummaryResponse' 
            },
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Error response for invalid params',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/invalidQueryParamsBetsSummaryResponse' 
            },
          }
        }
      }
    }
  */
);

betsRoutes.get(
  '/:id',
  async (request: Request, response: Response) => {
    const params = getBetParamsSchema.safeParse(request.params);

    if (!params.success) {
      return response.status(400).json(params.error);
    }

    const betsRepository = new BetsRepository();
    const bet = await betsRepository.findById(params.data.id);

    if (!bet) {
      return response.status(404).json({
        message: `Bet ${params.data.id} not found`,
      });
    }

    const { agree, disagree } = bet.betEntries.reduce(
      (previous, current) => {
        if (current.group === 1) {
          return {
            ...previous,
            agree: previous.agree + BigInt(current.amountEth),
          };
        }

        return {
          ...previous,
          disagree: previous.disagree + BigInt(current.amountEth),
        };
      },
      {
        agree: BigInt(0),
        disagree: BigInt(0),
      },
    );

    const betsWithAditionalInfo = {
      ...bet,
      betEntries: bet.betEntries.map((betEntry) => ({
        ...betEntry,
        amountEth: formatEther(betEntry.amountEth),
      })),
      prediction: await getCompleteBetPrediction(bet),
      tvlSpread: `${formatEther(agree)}/${formatEther(disagree)}`,
      tvl: formatEther(agree + disagree),
    };

    return response.json(betsWithAditionalInfo);
  },
  /**
    #swagger.tags = ['Bets']
    #swagger.summary = 'Find bet by id' 
  */
);

betsRoutes.get(
  '/transactions/:hash',
  async (request: Request, response: Response) => {
    const params = getBetByTransactionParamsSchema.safeParse(request.params);

    if (!params.success) {
      return response.status(400).json(params.error);
    }

    const betsRepository = new BetsRepository();
    const bet = await betsRepository.findByTransactionHash(params.data.hash);

    return response.json(bet);
  },
  /**
    #swagger.tags = ['Bets']
    #swagger.summary = 'Find bet by transaction hash' 
  */
);

betsRoutes.post(
  '/:betId/comments',
  verifyMessageMiddleware('text'),
  async (request: Request, response: Response) => {
    const body = sendCommentRequestSchema.safeParse({
      ...request.body,
      ...request.params,
    });

    if (!body.success) {
      return response.status(400).json(body.error);
    }

    const { userWallet, text, betId } = body.data;

    const commentsRepository = new CommentsRepository();
    const usersRepository = new UsersRepository();

    const user = await usersRepository.findOrCreateByWalletAddress(userWallet);

    const comment = await commentsRepository.save({
      userId: user.id,
      text,
      betId,
    });

    return response.status(201).json(comment);
  },
  /*
    #swagger.tags = ['Comments']
    #swagger.summary = 'Create comment'
    #swagger.responses[201] = {
      description: 'Success response from the create comment',
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
    #swagger.responses[400] = {
      description: 'Error response for invalid params',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/invalidQueryParamsListBetsResponse' 
            },
          }
        }
      }
    }
  */
);

betsRoutes.post(
  '/:betId/votes',
  verifyMessageMiddleware('group'),
  async (request: Request, response: Response) => {
    const body = sendVoteRequestSchema.safeParse({
      ...request.body,
      ...request.params,
    });

    if (!body.success) {
      return response.status(400).json(body.error);
    }

    const { userWallet, group, betId } = body.data;

    const votesRepository = new VotesRepository();
    const usersRepository = new UsersRepository();

    const user = await usersRepository.findOrCreateByWalletAddress(userWallet);

    const foundVote = await votesRepository.findByUserIdAndBetId(
      user.id,
      betId,
    );

    const sameVote = foundVote?.group === +group;

    if (sameVote) {
      return response.status(400).json({
        message: 'You have already voted once',
      });
    }

    if (foundVote) {
      await votesRepository.update(foundVote.id, {
        group,
      });

      return response.status(201).json({ ...foundVote, group });
    }

    const vote = await votesRepository.save({
      userId: user.id,
      group,
      betId,
    });

    return response.status(201).json(vote);
  },
  /*
    #swagger.tags = ['Votes']
    #swagger.summary = 'Create vote'
    #swagger.responses[201] = {
      description: 'Success response from the create vote',
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
    #swagger.responses[400] = {
      description: 'Error response for invalid params',
      content: {
        "application/json": {
          examples: {
            response: {
              $ref: '#/components/examples/invalidQueryParamsListBetsResponse'
            },
          }
        }
      }
    }
  */
);

export { betsRoutes };
