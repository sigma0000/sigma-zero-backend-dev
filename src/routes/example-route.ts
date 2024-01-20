import logger from '@/utils/logger';
import { Request, Response } from 'express';

export const exampleRoute = async (req: Request, res: Response) => {
  // Your route logic goes here
  res.send('Hello, world!');
  logger.info('Hello, world!');
};
