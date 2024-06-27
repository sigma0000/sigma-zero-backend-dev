import { BetTypeValues } from '@/constants/bet-type';
import { Bet } from '@/db/entities';
import { addSeconds, format } from 'date-fns';
import { TokenService } from '@/services';

export const getBetPrediction = (
  betType: BetTypeValues,
  value: bigint,
  auxiliaryValue: number,
) => {
  if (betType === 'price') {
    return `${betType} to $${value} (-${auxiliaryValue}%)`;
  }

  if (betType === 'volume') {
    return `${betType} to $${value} (${auxiliaryValue} days)`;
  }

  return 'liquidity';
};

export const getCompleteBetPrediction = async (bet: Bet) => {
  const {
    startDate,
    duration,
    tokenSnapshot: { tokenAddress },
    originator: { walletReduced },
  } = bet;
  const endDate = format(addSeconds(startDate, duration), 'MMMM do, yyyy');

  const tokenService = new TokenService();

  const token = await tokenService.getTokenDataByAddress(
    'ethereum',
    tokenAddress,
  );

  const defaultReturn = `${walletReduced} is betting that ${token?.symbol} will`;

  if (bet.betType === 'price') {
    return `${defaultReturn} drop ${bet.auxiliaryValue}% in value by ${endDate}`;
  }

  if (bet.betType === 'volume') {
    return `${defaultReturn} be ${bet.value} by ${endDate}`;
  }

  return `${defaultReturn} be liquidated`;
};
