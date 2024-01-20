import logger from '@/utils/logger';
import { ethers } from 'ethers';

class ContractEventsListenerService {
  private contract: ethers.Contract;

  constructor(contract: ethers.Contract) {
    this.contract = contract;
  }

  listen() {
    this.contract.on(
      'BetPlaced',
      (initiator, betType, wager, duration, betIndex) => {
        logger.info('BetPlaced', initiator, betType, wager, duration, betIndex);
      },
    );

    this.contract.on('BettorAdded', (bettor, betIndex, wager, bettingGroup) => {
      logger.info('BettorAdded', bettor, betIndex, wager, bettingGroup);
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
        logger.info(
          'BetSettled',
          initiator,
          firstBettorsGroup,
          secondBettorsGroup,
          betType,
          winners,
          payouts,
        );
      },
    );

    this.contract.on('BetVoided', (betIndex, initiator, betType) => {
      logger.info('BetVoided', betIndex, initiator, betType);
    });

    this.contract.on(
      'BetClosed',
      (betIndex, initiator, firstBettorsGroup, secondBettorsGroup, betType) => {
        logger.info(
          'BetClosed',
          betIndex,
          initiator,
          firstBettorsGroup,
          secondBettorsGroup,
          betType,
        );
      },
    );

    this.contract.on('BetApproved', (betIndex, initiator, betType) => {
      logger.info('BetApproved', betIndex, initiator, betType);
    });
  }
}

export default ContractEventsListenerService;
