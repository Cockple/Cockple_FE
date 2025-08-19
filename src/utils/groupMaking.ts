export const groupMaking = (
  selected: string[] | undefined,
  domain: string[],
  allLabel = "전체",
): string[] => {
  if (!selected || selected.length === 0) return [];
  const hasAny = selected.includes(allLabel);
  return hasAny
    ? domain.filter(v => v !== allLabel)
    : selected.filter(v => v !== allLabel);
};

export const parsePrice = (value?: string): number => {
  if (!value || value === "disabled") return 0;
  const trimmed = value.endsWith("원") ? value.slice(0, -1) : value;
  return Number(trimmed.replaceAll(",", ""));
};

export const parseKock = (value?: string): string => {
  if (!value || value === "disabled") return "";
  return value;
};

export const mapPartyType = (type?: string): string =>
  type === "female" ? "여복" : "혼복";
