export const reduceToken = (
  token: string,
  start: [number, number],
  end?: number,
) => {
  if (end) {
    return `${token.slice(...start)}...${token.slice(-end)}`;
  }

  return token.slice(...start);
};
