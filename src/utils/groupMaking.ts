export const groupMaking = (
  selected: string[] | undefined,
  domain: string[],
  allLabel = "전체",
): string[] => {
  if (!selected || selected.length === 0) return [];
  const hasAny = selected.includes(allLabel);
  if (hasAny) return domain.filter(v => v !== allLabel);
  return selected.filter(v => v !== allLabel);
};
