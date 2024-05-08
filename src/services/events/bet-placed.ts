import { isPast } from 'date-fns';

import logger from '@/utils/logger';
import { BetStatuses } from '@/db/enums';
import { ContractEventsListenerGetter } from '@/helpers';
import {
  BetsRepository,
  BetEntriesRepository,
  UsersRepository,
} from '@/db/repositories';
import {
  BET_TYPE,
  BET_TYPE_NUMBER,
  BetTypeOptions,
  betTypeOptions,
} from '@/constants/bet-type';

import { type MarketData, type EventContract, TokenService } from '../';
import ContractService from '../contract';

import {
  type BetPlacedData,
  betPlacedDataSchema,
} from '@/validators/bet-placed';

import {
  WAGERING_STYLE,
  WageringStyleOptions,
  wageringStyleOptions,
} from '@/constants/wagering-style';

const MAXIMUM_DURATION_BET_IN_DAYS = Number(
  process.env.MAXIMUM_DURATION_BET_IN_DAYS || 730,
);

interface BetPlacedParams extends BetPlacedData, EventContract {}

export class BetPlacedService {
  private contractService: ContractService;
  private tokenService: TokenService;
  private betsRepository: BetsRepository;
  private usersRepository: UsersRepository;
  private betEntriesRepository: BetEntriesRepository;

  constructor(private contractEvents: ContractEventsListenerGetter) {
    this.contractService = new ContractService(contractEvents);
    this.tokenService = new TokenService();
    this.betsRepository = new BetsRepository();
    this.usersRepository = new UsersRepository();
    this.betEntriesRepository = new BetEntriesRepository();
  }

  public async execute({ event, ...data }: BetPlacedParams) {
    logger.info('BetPlaced', data);

    const schemaValidated = betPlacedDataSchema.safeParse(data);

    if (!schemaValidated.success) {
      logger.error(`BetPlaced validation error`, schemaValidated.error);
      return;
    }

    const {
      address,
      auxiliaryValue,
      betIndex,
      betType,
      wager,
      duration,
      initiator,
      option,
      startDateTime,
      value,
      wageringStyle,
    } = schemaValidated.data;

    if (!this.isValidBetType(betType)) {
      logger.warn(`The bet type: ${betType} is not valid`);
      return;
    }

    if (!this.isValidWageringStyle(wageringStyle)) {
      logger.warn(`The Wagering style: ${wageringStyle} is not valid`);
      return;
    }

    if (isPast(startDateTime)) {
      logger.warn('It is not possible to create bets in the past.');
      return;
    }

    const durationInDays = duration / 60 / 60 / 24;

    if (durationInDays > MAXIMUM_DURATION_BET_IN_DAYS) {
      logger.warn(
        `It is not possible to create contracts that last more than ${MAXIMUM_DURATION_BET_IN_DAYS} days.`,
      );
      return;
    }

    const user =
      await this.usersRepository.findOrCreateByWalletAddress(initiator);

    const tokenData = await this.getTokenPrice(address);

    if (tokenData == null) {
      logger.warn(`The token value for the ${address} clause was not found.`);
      return;
    }

    const { market_data: marketData, pair, pairType } = tokenData;

    const price = this.getPriceByBetType(Number(betType), marketData);

    if (price == null) {
      logger.warn(`The token value for the ${address} clause was not found.`);
      return;
    }

    const { current_price: currentPrice, total_volume: totalVolume } =
      marketData;

    const { transactionIndex, transactionHash, blockNumber } = event.log;

    const [transaction, receipt] =
      await this.contractEvents.getTransactionDetails(transactionHash);

    const bet = await this.betsRepository.save({
      value,
      auxiliaryValue,
      option,
      betType: BET_TYPE_NUMBER[betType],
      duration,
      index: betIndex,
      originatorId: user.id,
      status: BetStatuses.Initiated,
      startDate: startDateTime,
      tokenSnapshot: {
        volume: totalVolume.usd,
        price: currentPrice.usd,
        liquidity: currentPrice.usd,
        tokenAddress: address,
        pair,
        pairType,
      },
      transaction: {
        gasPrice: transaction?.gasPrice ?? 0,
        gasUsed: receipt?.gasUsed ?? 0,
        value: Number(transaction?.value),
        transactionIndex,
        hash: transactionHash,
        blockNumber,
        fromAddress: initiator,
        toAddress: address,
        timestamp: new Date(),
      },
      wageringStyle: WAGERING_STYLE[wageringStyle],
    });

    const scaleFactor = 1e18;
    const scaledPrice = BigInt(Math.floor(price * scaleFactor));
    const scaledValue = BigInt(Math.floor(Number(value) * scaleFactor));

    await this.betEntriesRepository.save({
      amountEth: wager,
      betId: bet.id,
      transactionHash,
      userId: user.id,
      group: 1,
    });

    this.contractService.setBetValue(
      betIndex,
      Number(betType) === BET_TYPE.Liquidity ? scaledPrice : scaledValue,
    );
  }

  private async getTokenPrice(address: string) {
    const tokenData = await this.tokenService.getTokenDataByAddress(
      'ethereum',
      address,
    );

    if (!tokenData) {
      return;
    }

    return tokenData;
  }

  private getPriceByBetType(betType: number, marketData: MarketData) {
    const { current_price: currentPrice, total_volume: totalVolume } =
      marketData;

    if (betType === BET_TYPE.Liquidity || betType === BET_TYPE.Price) {
      return currentPrice.usd;
    }

    if (betType === BET_TYPE.Volume) {
      return totalVolume.usd;
    }
  }

  private isValidBetType(betType: string): betType is BetTypeOptions {
    return betTypeOptions.includes(betType as BetTypeOptions);
  }

  private isValidWageringStyle(
    wageringStyle: string,
  ): wageringStyle is WageringStyleOptions {
    return wageringStyleOptions.includes(wageringStyle as WageringStyleOptions);
  }
}
