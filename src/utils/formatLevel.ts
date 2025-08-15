export const formatLevel = (levels: string[]): string => {
  if (!levels || levels.length === 0) return "";
  if (levels.length === 1) {
    return `${levels[0]}이상`;
  }
  return `${levels[0]}~${levels[levels.length - 1]}`;
};
