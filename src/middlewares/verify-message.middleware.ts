import logger from '@/utils/logger';
import { verifyMessage } from 'ethers';
import type { NextFunction, Request, Response } from 'express';

export function verifyMessageMiddleware(field: string) {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const signerAddress = verifyMessage(
        request.body[field],
        request.body.signature,
      );

      if (signerAddress !== request.body.userWallet) {
        throw new Error('User not authorized');
      }
    } catch (error) {
      logger.error(error);
      return response.status(401).json({
        message: 'User not authorized',
      });
    }

    return next();
  };
}
