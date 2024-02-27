export const BET_TYPE = Object.freeze({
  Liquidity: 0,
  Volume: 1,
  Price: 2,
});

export const BET_TYPE_NUMBER = Object.freeze({
  '0': 'liquidity',
  '1': 'volume',
  '2': 'price',
});

export type BetTypeValues =
  (typeof BET_TYPE_NUMBER)[keyof typeof BET_TYPE_NUMBER];
export type BetTypeOptions = keyof typeof BET_TYPE_NUMBER;
export const betTypeOptions = Object.keys(
  BET_TYPE_NUMBER,
) as readonly BetTypeOptions[];
