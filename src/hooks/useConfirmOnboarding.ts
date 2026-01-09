import { usePostKeywords, usePostOnboarding } from "@/api/member/onboarding";
import { useKeywordSelect } from "@/hooks/useKeywordSelect";
import { useOnboardingState } from "@/store/useOnboardingStore";
import { userLevelMapper } from "@/utils/levelValueExchange";

interface useSubmitOnboardingProps {
  apiPartyId: number;
  mappedKeywords: string[];
  onboarding: boolean;
}

export default function useSubmitOnboarding({
  apiPartyId,
  mappedKeywords,
  onboarding,
}: useSubmitOnboardingProps) {
  const { level, memberName, gender, birth, imgKey } = useOnboardingState();
  const { selectedTag } = useKeywordSelect();
  const { toEng } = userLevelMapper();
  const handleOnboardingForm = usePostOnboarding();
  const handleKeywordsForm = usePostKeywords();

  const submitOnboarding = () => {
    if (onboarding) {
      handleOnboardingForm.mutate({
        memberName,
        gender: (gender ?? "").toUpperCase(),
        birth: birth.split(".").join("-"),
        level: toEng(level),
        keywords: mappedKeywords,
        imgKey: imgKey,
      });
    } else {
      handleKeywordsForm.mutate({
        partyId: apiPartyId,
        keywords: selectedTag,
      });
    }
  };

  return { submitOnboarding };
}
