import { useLocation, useParams } from "react-router-dom";
import TagBtn from "@/components/common/DynamicBtn/TagBtn";
import Btn_Static from "@/components/common/Btn_Static/Btn_Static";
import IntroText from "@/components/onboarding/IntroText";
import Onboarding4 from "@/assets/images/onboarding3.png?url";
import { useOnboardingState } from "@/store/useOnboardingStore";
import { userLevelMapper } from "@/utils/levelValueExchange";
import { TAGMAP } from "@/constants/options";
import {
  usePostKeywords,
  usePostOnboarding,
} from "../../api/member/onboarding";
import { keywordMap } from "@/constants/onboarding";
import { useKeywordSelect } from "@/hooks/useKeywordSelect";

export const ConfirmPage = () => {
  const location = useLocation();
  const onboarding = location.state?.onboarding ?? true;

  const params = useParams();
  const apiPartyId = Number(params.partyId);

  const { level, memberName, gender, birth, imgKey } = useOnboardingState();
  const { toEng } = userLevelMapper();
  const { selectedTag, toggleTag } = useKeywordSelect();

  const mappedKeywords =
    selectedTag.length > 0
      ? selectedTag.map(tag => keywordMap[tag]).filter(Boolean)
      : ["NONE"];

  const handleOnboardingForm = usePostOnboarding();
  const handleKeywordsForm = usePostKeywords();

  const handleNext = () => {
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

  return (
    <div className="w-full flex flex-col -mb-8 min-h-dvh ">
      <section className="flex items-center flex-col gap-10 flex-1">
        <IntroText
          title={
            onboarding ? "가입이 완료되었어요!" : "멋진 모임이 만들어졌어요!"
          }
          text1="키워드를 선택하고"
          text2="더 많은 모임과 연결되어 볼까요?"
          isBar={false}
        />

        <div>
          <img src={Onboarding4} alt="가입완료 이미지" className="size-40" />
        </div>
        <div className="flex flex-wrap gap-[0.625rem] items-center justify-center">
          {TAGMAP.map(item => {
            return (
              <TagBtn
                key={item}
                isSelected={selectedTag.includes(item)}
                onClick={() => toggleTag(item)}
              >
                {item}
              </TagBtn>
            );
          })}
        </div>
      </section>
      <div
        className="flex items-center justify-center header-h4 mb-6 "
        onClick={handleNext}
      >
        <Btn_Static
          label={onboarding ? "다음" : "신규 멤버 추천 받기"}
          kind="GR400"
          size="L"
        />
      </div>
    </div>
  );
};
