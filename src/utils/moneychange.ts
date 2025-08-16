export const digits = (s: string) => s.replace(/\D/g, "");

export const fmtKRW = (s: string) =>
  s === "" ? "" : Number(digits(s)).toLocaleString();

export const addWon = (s: string) => (s && s !== "0" ? `${s}원` : s);

export const stripWon = (s: string) =>
  s.endsWith("원") ? s.slice(0, -1).replaceAll(",", "") : s;
