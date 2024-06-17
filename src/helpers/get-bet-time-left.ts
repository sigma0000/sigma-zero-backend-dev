import { BetStatuses } from '@/db/enums';
import { addSeconds, differenceInDays } from 'date-fns';

const getTextFormatted = (status: 'close' | 'settled', days: number) => {
  if (days === 0) {
    return `${status} today` as const;
  }

  return `${days} days to ${status}` as const;
};

export const getBetTimeLeft = (
  status: BetStatuses,
  startDate: Date,
  duration: number,
) => {
  if (status === BetStatuses.Approved) {
    const days = differenceInDays(startDate, new Date());

    return days < 0 ? ('expired' as const) : getTextFormatted('close', days);
  }

  if (status === BetStatuses.Closed) {
    const endDate = addSeconds(startDate, duration);
    const days = differenceInDays(endDate, new Date());

    return days < 0 ? ('expired' as const) : getTextFormatted('settled', days);
  }

  return '-' as const;
};
