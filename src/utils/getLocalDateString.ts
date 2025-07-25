// utils/getLocalDateString.ts

export const getLocalDateString = (): string => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0]; // 예: "2025-07-22"
};
