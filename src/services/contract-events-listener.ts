import { ethers } from 'ethers';
import logger from '@/utils/logger';
import ContractEventsListenerGetter from '@/helpers/contract-events-listener-getter';
import { BET_TYPE } from '@/constants/bet-type';
import ContractService from './contract';
import TokenService from './token';

const { COINGECKO_API_URL, COINGECKO_API_KEY } = process.env;

class ContractEventsListenerService {
  private contract: ethers.Contract;
  private contractService: ContractService;
  private tokenService: TokenService;

  constructor(contractEvents: ContractEventsListenerGetter) {
    this.contract = contractEvents.getContract();
    this.contractService = new ContractService(contractEvents);
    this.tokenService = new TokenService(
      COINGECKO_API_URL!,
      COINGECKO_API_KEY!,
    );
  }

  listen() {
    this.contract.on(
      'BetPlaced',
      async (initiator, address, betType, wager, duration, betIndex) => {
        logger.info('BetPlaced', {
          initiator,
          address,
          betType,
          wager,
          duration,
          betIndex,
        });

        const value = await this.getTokenPriceByBetType(Number(betType));

        if (value == null) {
          logger.warning(
            `The token value for the ${address} clause was not found.`,
          );
          return;
        }

        this.contractService.setBetValue(betIndex, value);
      },
    );

    this.contract.on('BettorAdded', (bettor, betIndex, wager, bettingGroup) => {
      logger.info('BettorAdded', { bettor, betIndex, wager, bettingGroup });
    });

    this.contract.on(
      'BetSettled',
      (
        initiator,
        firstBettorsGroup,
        secondBettorsGroup,
        betType,
        winners,
        payouts,
      ) => {
        logger.info('BetSettled', {
          initiator,
          firstBettorsGroup,
          secondBettorsGroup,
          betType,
          winners,
          payouts,
        });
      },
    );

    this.contract.on('BetVoided', (betIndex, initiator, betType) => {
      logger.info('BetVoided', { betIndex, initiator, betType });
    });

    this.contract.on(
      'BetClosed',
      (betIndex, initiator, firstBettorsGroup, secondBettorsGroup, betType) => {
        logger.info('BetClosed', {
          betIndex,
          initiator,
          firstBettorsGroup,
          secondBettorsGroup,
          betType,
        });
      },
    );

    this.contract.on('BetApproved', (betIndex, initiator, betType) => {
      logger.info('BetApproved', { betIndex, initiator, betType });
    });
  }

  private async getTokenPriceByBetType(betType: number) {
    const coinsList = await this.tokenService.getCoinsList();

    if (!coinsList || !coinsList.length) {
      return;
    }

    const tokenData = await this.tokenService.getTokenData('ethereum');

    if (!tokenData) {
      return;
    }

    const {
      market_data: { current_price, total_volume },
    } = tokenData;

    if (betType === BET_TYPE.Liquidity) {
      // @todo how get this value?
      return 0;
    }

    if (betType === BET_TYPE.Price) {
      return current_price.usd;
    }

    if (betType === BET_TYPE.Volume) {
      return total_volume.usd;
    }
  }
}

export default ContractEventsListenerService;
