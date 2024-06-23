import { Router, type Request, type Response } from 'express';

import { sanitizeMiddleware } from '@/middlewares/sanitize-html.middleware';
import { TokenService } from '@/services';
import { getTokenParamsSchema } from '@/validators/get-token-params';
import TokenCache from '@/helpers/token-cache';
import logger from '@/utils/logger';
import { getCoinParamsSchema } from '@/validators/get-coin-params';

const coinsRoutes = Router();

coinsRoutes.get(
  '/',
  async (_: Request, response: Response) => {
    const tokenService = new TokenService();

    const coins = await tokenService.getCoinsListEthereum();

    return response.json(coins);
  },
  /*
    #swagger.tags = ['Coins']
    #swagger.summary = 'Searches all the coins'
    #swagger.responses[200] = {
      description: 'Success response from the coins search.',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/listCoinsResponse' 
            },
          }
        }
      }
    }
  */
);

coinsRoutes.get(
  '/:coin/tokens/:token',
  sanitizeMiddleware,
  async (request: Request, response: Response) => {
    const result = getTokenParamsSchema.safeParse(request.params);

    if (!result.success) {
      return response.status(400).json(result.error);
    }

    const { coin, token } = result.data;

    const tokenService = new TokenService();
    const tokenCache = new TokenCache();

    try {
      if (await tokenCache.exists(token)) {
        const tokenData = await tokenCache.get(token);

        return response.json(tokenData);
      }
    } catch (error) {
      logger.error(
        `It was not possible to retrieve the ${token} token from the cache`,
      );
    }

    const tokenData = await tokenService.getTokenDataByAddress(coin, token);

    if (!tokenData) {
      return response.status(404).json({
        message: 'Token not found',
      });
    }

    // 'then' was used here because the application cannot depend on the cache to function.
    tokenCache
      .set(token, tokenData)
      .then()
      .catch((error) => {
        logger.error(
          `It was not possible to set the ${token} token in the cache`,
          error,
        );
      });

    return response.json(tokenData);
  },
  /*
    #swagger.tags = ['Coins']
    #swagger.summary = 'Searches for specific information of a token'
    #swagger.responses[200] = {
      description: 'Success response from the coins search.',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/getTokenResponse' 
            },
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Error response for token not found',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/tokenNotFoundErrorResponse' 
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
              $ref: '#/components/examples/invalidParamsSearchTokenResponse' 
            },
          }
        }
      }
    }
  */
);

coinsRoutes.get(
  '/:coin',
  sanitizeMiddleware,
  async (request: Request, response: Response) => {
    const result = getCoinParamsSchema.safeParse(request.params);

    if (!result.success) {
      return response.status(400).json(result.error);
    }

    const { coin } = result.data;

    const tokenService = new TokenService();
    const tokenCache = new TokenCache();

    try {
      if (await tokenCache.exists(coin)) {
        const tokenData = await tokenCache.get(coin);

        return response.json(tokenData);
      }
    } catch (error) {
      logger.error(
        `It was not possible to retrieve the ${coin} price from the cache`,
      );
    }

    const tokenData = await tokenService.getTokenData(coin);

    if (!tokenData) {
      return response.status(404).json({
        message: 'Coin not found',
      });
    }

    // 'then' was used here because the application cannot depend on the cache to function.
    tokenCache
      .set(coin, tokenData)
      .then()
      .catch((error) => {
        logger.error(
          `It was not possible to set the ${coin} token in the cache`,
          error,
        );
      });

    return response.json(tokenData);
  },
  /*
    #swagger.tags = ['Coins']
    #swagger.summary = 'Searches for specific information of a coin'
    #swagger.responses[200] = {
      description: 'Success response from the coins search.',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/getTokenResponse' 
            },
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Error response for token not found',
      content: {
        "application/json": {
          examples: {
            response: { 
              $ref: '#/components/examples/tokenNotFoundErrorResponse' 
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
              $ref: '#/components/examples/invalidParamsSearchTokenResponse' 
            },
          }
        }
      }
    }
  */
);

export { coinsRoutes };
