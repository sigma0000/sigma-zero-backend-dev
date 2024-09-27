import { Router } from 'express';

import { coinsRoutes } from './coins-route';
import { betsRoutes } from './bets-route';
import { userRoutes } from './users-route';

const routes = Router();

routes.use('/coins', coinsRoutes);
routes.use('/bets', betsRoutes);
routes.use('/users', userRoutes);

export { routes };
