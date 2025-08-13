// // 1. UTC timestamp → 한국 시간 Date 객체 변환
// export function toKSTDate(utcString: string): Date {
//   //utcString: 2025-08-13T13:48:26.269512
//   // 서버에서 받은 UTC 시간을 Date로 변환, Wed Aug 13 2025 13:48:26 GMT+0900 (한국 표준시)
//   const utcDate = new Date(utcString);
//   // KST로 변환 (UTC+9), Wed Aug 13 2025 22:48:26 GMT+0900 (한국 표준시)
//   const kstTime = utcDate.getTime() + 9 * 60 * 60 * 1000;
//   return new Date(kstTime);
// }

// // 2. "yyyy.mm.dd (요일)" 형식으로 변환
// export function formatDateWithDay(utcString: string): string {
//   const kstDate = toKSTDate(utcString);
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const year = kstDate.getFullYear();
//   const month = String(kstDate.getMonth() + 1).padStart(2, "0");
//   const date = String(kstDate.getDate()).padStart(2, "0");
//   const dayName = days[kstDate.getDay()];
//   return `${year}.${month}.${date} (${dayName})`;
// }

// // 3. "오전/오후 hh:mm" 형식으로 변환
// export function formatAmPmTime(utcString: string): string {
//   const kstDate = toKSTDate(utcString);
//   let hours = kstDate.getHours();
//   const minutes = String(kstDate.getMinutes()).padStart(2, "0");
//   const ampm = hours < 12 ? "오전" : "오후";
//   hours = hours % 12;
//   if (hours === 0) hours = 12;
//   return `${ampm} ${String(hours).padStart(2, "0")}:${minutes}`;
// }
// 무조건 UTC로 파싱(없으면 Z 붙이기, 마이크로초 정리)
function normalizeUtc(input: string): string {
  let s = input.trim();
  s = s.replace(/(\.\d{3})\d+$/, "$1"); // .ssssss → .sss
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(s)) s += "Z";
  return s;
}

function toDateFromUTC(utcString: string): Date {
  return new Date(normalizeUtc(utcString)); // +9h 안 함
}

export function formatDateWithDay(utcString: string): string {
  const d = toDateFromUTC(utcString);
  const y = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).format(d);
  const m = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "2-digit",
  }).format(d);
  const day = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    day: "2-digit",
  }).format(d);
  const w = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    weekday: "short",
  }).format(d);
  return `${y}.${m}.${day} (${w})`;
}

export function formatEnLowerAmPm(utcString: string): string {
  const d = toDateFromUTC(utcString);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    hour: "numeric", // 1~12 (앞에 0 없음)
    minute: "2-digit", // 00~59
    hour12: true,
  }).formatToParts(d);

  const hour = parts.find(p => p.type === "hour")?.value ?? "";
  const minute = parts.find(p => p.type === "minute")?.value ?? "";
  const period = (
    parts.find(p => p.type === "dayPeriod")?.value ?? ""
  ).toLowerCase(); // am/pm

  return `${hour}:${minute} ${period}`;
}

export function formatAmPmTime(utcString: string): string {
  const d = toDateFromUTC(utcString);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .replace(/\s+/g, " ")
    .trim();
}
