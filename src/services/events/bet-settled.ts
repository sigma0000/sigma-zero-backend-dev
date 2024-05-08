import logger from '@/utils/logger';
import { BetStatuses } from '@/db/enums';
import { ContractEventsListenerGetter } from '@/helpers';
import { BetsRepository, ResultsRepository } from '@/db/repositories';
import type { EventContract } from '../contract-events-listener';
import { BetEntriesResultsRepository } from '@/db/repositories/bet-entries-results-repository';

interface BetSettledData extends EventContract {
  betIndex: number;
  initiator: string;
  isFirstGroupWinner: boolean;
  firstBettorsGroup: [];
  secondBettorsGroup: [];
  betType: string;
  winners: string[][];
  payouts: string[][];
}

export class BetSettledService {
  private betsRepository: BetsRepository;
  private resultsRepository: ResultsRepository;
  private betEntriesResultsRepository: BetEntriesResultsRepository;

  constructor(private contractEvents: ContractEventsListenerGetter) {
    this.betsRepository = new BetsRepository();
    this.resultsRepository = new ResultsRepository();
    this.betEntriesResultsRepository = new BetEntriesResultsRepository();
  }

  public async execute({
    betIndex,
    initiator,
    isFirstGroupWinner,
    firstBettorsGroup,
    secondBettorsGroup,
    betType,
    winners,
    payouts,
    event,
  }: BetSettledData) {
    logger.info('BetSettled', {
      betIndex,
      initiator,
      isFirstGroupWinner,
      firstBettorsGroup,
      secondBettorsGroup,
      betType,
      winners,
      payouts,
    });

    const bet = await this.betsRepository.findByIndex(betIndex);

    if (!bet) {
      logger.error(`Bet ${betIndex} not found`);
      return;
    }

    await this.betsRepository.updateStatusByIndex(
      BetStatuses.Settled,
      betIndex,
    );

    const { transactionIndex, transactionHash, blockNumber } = event.log;

    const [transaction, receipt] =
      await this.contractEvents.getTransactionDetails(transactionHash);

    const transactionToSave = {
      gasPrice: transaction?.gasPrice ?? 0,
      gasUsed: receipt?.gasUsed ?? 0,
      value: Number(transaction?.value),
      transactionIndex,
      hash: transactionHash,
      blockNumber,
      fromAddress: transaction?.from,
      toAddress: transaction?.to || undefined,
      timestamp: new Date(),
    };

    const winnerGroup = isFirstGroupWinner ? 1 : 2;

    const result = await this.resultsRepository.save({
      betId: bet.id,
      tokenSnapshotId: bet.tokenSnapshotId,
      winnerGroup,
      transaction: transactionToSave,
    });

    const { firstGroupPool, secondGroupPool } = bet.betEntries.reduce(
      (previous, current) => {
        const group =
          +current.group === 1 ? 'firstGroupPool' : 'secondGroupPool';

        return {
          ...previous,
          [group]: previous[group] + Number(current.amountEth),
        };
      },
      {
        firstGroupPool: 0,
        secondGroupPool: 0,
      },
    );

    const selfPool = isFirstGroupWinner ? firstGroupPool : secondGroupPool;
    const pool = isFirstGroupWinner ? secondGroupPool : firstGroupPool;

    await Promise.all(
      bet.betEntries.map(async (betEntry) =>
        this.betEntriesResultsRepository.save({
          resultId: result.id,
          betEntryId: betEntry.id,
          transaction: transactionToSave,
          amountEth:
            betEntry.group === winnerGroup
              ? (Number(betEntry.amountEth) * pool) / selfPool +
                Number(betEntry.amountEth)
              : 0,
        }),
      ),
    );
  }
}
