import cron from 'node-cron';
import { ethers } from 'ethers';
import { addDays, isEqual, isPast } from 'date-fns';

import logger from '@/utils/logger';
import BetsRepository from '@/db/repositories/bets-repository';

const { CRON_TIMES } = process.env;

class CheckBetEndsCron {
  private cronTimes: string[];
  private betsRepository: BetsRepository;

  constructor(private contract: ethers.Contract) {
    this.cronTimes = CRON_TIMES?.split(',') || [];
    this.betsRepository = new BetsRepository();
  }

  startCron() {
    this.cronTimes.forEach((time) => {
      cron.schedule(time, this.checkCron.bind(this), {
        scheduled: true,
        timezone: 'UTC',
      });
    });
  }

  private async checkCron() {
    logger.info('Cron triggered');

    const bets =
      await this.betsRepository.findAllWithStatusApprovedAndInitiated();

    const finishedBets = bets.filter((bet) => {
      const endDate = addDays(bet.startDate, bet.contractLength);
      return isEqual(endDate, new Date()) || isPast(endDate);
    });

    await Promise.all([
      finishedBets.map((bet) => {
        logger.info(`Bet with id ${bet.id} has run out of time.`);

        return this.contract.calculateResultsAndDistributeWinnings(
          bet.index,
          bet.transaction.value,
        );
      }),
    ]);
  }
}

export default CheckBetEndsCron;
