import { connectToDB } from '@/db';
import ContractEventsListenerGetter from '@/helpers/contract-events-listener-getter';
import { exampleRoute } from '@/routes/example-route';
import ContractEventsListenerService from '@/services/contract-events-listener';
import logger from '@/utils/logger';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import TokenService from './services/token';

dotenv.config();

const { CONTRACT_ADDRESS, COINGECKO_API_KEY, COINGECKO_API_URL } = process.env;

const port = 3000;
const app = express();

connectToDB();

const contractEventsListenerGetter = new ContractEventsListenerGetter(
  CONTRACT_ADDRESS!,
  './contracts/SigmaZero.json',
);
const contractEventsListenerService = new ContractEventsListenerService(
  contractEventsListenerGetter.getContract(),
);

contractEventsListenerService.listen();

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  },
);

// TODO: This is just a test as an example. Remove it after using it in the corresponding endpoints.
const testTokenService = async () => {
  const tokenService = new TokenService(COINGECKO_API_URL!, COINGECKO_API_KEY!);

  const coinsList = await tokenService.getCoinsList();

  if (coinsList && coinsList.length > 0) {
    const tokenData = await tokenService.getTokenData('ethereum');

    logger.info(coinsList.find((coin) => coin.id === 'ethereum'));
    logger.info(tokenData?.market_data.current_price.usd);
    logger.info(tokenData?.market_data.total_volume.usd);
  }
};

testTokenService();

app.use(morganMiddleware);

app.get('/', exampleRoute);

app.listen(port, () => {
  return logger.info(`Express is listening at http://localhost:${port}`);
});
