import { ethers } from 'ethers';
import { isEqual, isPast } from 'date-fns';

import logger from '@/utils/logger';
import { BetsRepository } from '@/db/repositories';
import CronProvider from '@/helpers/cron-provider';

const { CHECK_BET_STARTS_CRON_TIMES } = process.env;

export class CheckBetStartsCron extends CronProvider {
  private betsRepository: BetsRepository;

  constructor(private contract: ethers.Contract) {
    super(CHECK_BET_STARTS_CRON_TIMES?.split(',') || []);
    this.betsRepository = new BetsRepository();
  }

  protected async checkCron() {
    try {
      logger.info('Check bet starts cron triggered');

      const bets = await this.betsRepository.findAllWithStatusApproved();

      const startedBets = bets.filter(
        ({ startDate }) => isEqual(startDate, new Date()) || isPast(startDate),
      );

      const betsProcessed = await Promise.allSettled(
        startedBets.map((bet) => {
          logger.info(`The Bet with id ${bet.id} was started`);

          return this.contract.closeBet(bet.index);
        }),
      );

      logger.info(betsProcessed);
    } catch (error) {
      logger.error(error);
    }
  }
}
