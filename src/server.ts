import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';

import CheckBetEndsCron from './services/check-bet-ends-cron';
import { parseEther } from 'ethers';

import logger from '@/utils/logger';
import ContractEventsListenerGetter from '@/helpers/contract-events-listener-getter';
import { exampleRoute } from '@/routes/example-route';
import ContractEventsListenerService from '@/services/contract-events-listener';
import { AppDataSource } from './db';

const { CONTRACT_ADDRESS } = process.env;

const port = 3000;
const app = express();

(async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established successfully.');
  } catch (error) {
    logger.error('Error connecting to the database.', error);
  }
})();

// TODO: important to make sure that the ABI stored in this repo is up-to-date with the latest version of the smart contract
const contractEventsListenerGetter = new ContractEventsListenerGetter(
  CONTRACT_ADDRESS!,
  `${__dirname}/contracts/SigmaZero.json`,
);
const contractEventsListenerService = new ContractEventsListenerService(
  contractEventsListenerGetter,
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

async function testPlaceBet() {
  try {
    const betValue = parseEther('000000000000000000000000000000000000000.1');
    const transaction = await contractEventsListenerGetter
      .getContract()
      .placeBet('0xb9ef770b6a5e12e45983c5d80545258aa38f3b78', 60, 0, betValue);

    await transaction.wait();

    logger.debug('placeBet ok');
  } catch (error) {
    logger.error('Error placeBet:', error);
  }
}

testPlaceBet();

new CheckBetEndsCron(contractEventsListenerGetter.getContract()).startCron();

app.use(morganMiddleware);

app.get('/', exampleRoute);

app.listen(port, () => {
  return logger.info(`Express is listening at http://localhost:${port}`);
});
