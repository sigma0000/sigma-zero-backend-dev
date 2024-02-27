export const WAGERING_STYLE = Object.freeze({
  '0': 'individual',
  '1': 'group',
});

export type WageringStyleValues =
  (typeof WAGERING_STYLE)[keyof typeof WAGERING_STYLE];

export type WageringStyleOptions = keyof typeof WAGERING_STYLE;
export const wageringStyleOptions = Object.keys(
  WAGERING_STYLE,
) as readonly WageringStyleOptions[];
