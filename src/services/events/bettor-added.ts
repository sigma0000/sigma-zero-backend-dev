import logger from '@/utils/logger';

import { ContractEventsListenerGetter } from '@/helpers';
import {
  BetEntriesRepository,
  BetsRepository,
  UsersRepository,
} from '@/db/repositories';
import type { EventContract } from '../contract-events-listener';

interface BettorAddedData extends EventContract {
  bettor: `0x${string}`;
  betIndex: number;
  wager: bigint;
  bettingGroup: number;
}

export class BettorAddedService {
  private betsRepository: BetsRepository;
  private usersRepository: UsersRepository;
  private betEntriesRepository: BetEntriesRepository;

  constructor(private contractEvents: ContractEventsListenerGetter) {
    this.betsRepository = new BetsRepository();
    this.usersRepository = new UsersRepository();
    this.betEntriesRepository = new BetEntriesRepository();
  }

  public async execute({
    bettor,
    betIndex,
    wager,
    bettingGroup,
    event,
  }: BettorAddedData) {
    logger.info('BettorAdded', { bettor, betIndex, wager, bettingGroup });

    const bet = await this.betsRepository.findByIndex(betIndex);

    if (!bet) {
      logger.error(`Bet ${betIndex} not found`);
      return;
    }

    const { transactionIndex, transactionHash, blockNumber } = event.log;

    const [user, [transaction, receipt]] = await Promise.all([
      this.usersRepository.findOrCreateByWalletAddress(bettor),
      this.contractEvents.getTransactionDetails(transactionHash),
    ]);

    await this.betEntriesRepository.save({
      amountEth: wager,
      betId: bet.id,
      group: bettingGroup,
      userId: user.id,
      transaction: {
        gasPrice: transaction?.gasPrice ?? 0,
        gasUsed: receipt?.gasUsed ?? 0,
        value: Number(transaction?.value),
        transactionIndex,
        hash: transactionHash,
        blockNumber,
        fromAddress: transaction?.from,
        toAddress: transaction?.to || undefined,
        timestamp: new Date(),
      },
    });
  }
}
