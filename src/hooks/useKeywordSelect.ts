import { useGroupMakingFilterStore } from "@/store/useGroupMakingFilter";
import { useOnboardingState } from "@/store/useOnboardingStore";
import { useState } from "react";

export const useKeywordSelect = (innitial: string[] = []) => {
  const { setFilter } = useGroupMakingFilterStore();
  const { setTemp } = useOnboardingState();
  const [selectedTag, setSelectedTag] = useState<string[]>(innitial ?? []);

  const toggleTag = (tag: string) => {
    const tagUpdated = selectedTag.includes(tag)
      ? selectedTag.filter(t => t !== tag)
      : [...selectedTag, tag];
    setSelectedTag(tagUpdated);
    setTemp({ keyword: tagUpdated });
    setFilter("keywords", tagUpdated);
  };

  return { selectedTag, toggleTag };
};
