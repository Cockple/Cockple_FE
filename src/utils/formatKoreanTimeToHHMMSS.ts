export function formatKoreanTimeToHHMMSS(timeString: string): string {
  if (!timeString) return "";

  const parts = timeString.replace("시", "").replace("분", "").split(" ");

  let hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);
  const period = parts[2].toLowerCase();

  if (period === "pm" && hour !== 12) {
    hour += 12;
  } else if (period === "am" && hour === 12) {
    hour = 0;
  }

  const formattedHour = String(hour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");

  return `${formattedHour}:${formattedMinute}`;
}

export const formatToKoreanTimeWithAmPm = (time: string) => {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = minuteStr.padStart(2, "0");

  const isAm = hour < 12;

  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const paddedHour = String(displayHour).padStart(2, "0");

  return `${paddedHour}시 ${minute}분 ${isAm ? "am" : "pm"}`;
};
