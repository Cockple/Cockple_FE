export const handleInput =
  (maxLen: number, setter: (v: string) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
      .slice(0, maxLen)
      .replace(/[^가-힣a-zA-Z\s\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/g, "");
    setter(v);
  };
