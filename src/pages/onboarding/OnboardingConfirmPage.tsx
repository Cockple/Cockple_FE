import { useLocation, useNavigate } from "react-router-dom";
import TagBtn from "../../components/common/DynamicBtn/TagBtn";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import IntroText from "../../components/onboarding/IntroText";
import KittyImg from "@/assets/images/kitty.png?url";
import { useMutation } from "@tanstack/react-query";
import { useOnboardingState } from "../../store/useOnboardingStore";
import api from "../../api/api";
import { useEffect, useState } from "react";
import type { onBoardingRequestDto } from "../../types/auth";
import { getApiLevel } from "../../utils/onboardingAPIMap";

export const ConfirmPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onboarding = location.state?.onboarding ?? true;

  const axios = api;
  const tagMap = [
    "브랜드 스폰",
    "가입비 무료",
    "친목",
    "운영진이 게임을 짜드려요",
  ];

  const { level, memberName, gender, birth } = useOnboardingState();

  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  //태그 선택
  const toggleTag = (tag: string) => {
    setSelectedTag(pre =>
      pre.includes(tag) ? pre.filter(t => t !== tag) : [...pre, tag],
    );
  };
  useEffect(() => {}, [selectedTag]);

  const keywordMap: Record<string, string> = {
    "브랜드 스폰": "BRAND",
    "가입비 무료": "FREE",
    친목: "FRIENDSHIP",
    "운영진이 게임을 짜드려요": "MANAGER_MATCH",
  };
  const mappedKeywords =
    selectedTag.length > 0
      ? selectedTag.map(tag => keywordMap[tag]).filter(Boolean)
      : ["NONE"];

  const handleSubmitForm = useMutation({
    mutationFn: () => {
      const body = {
        memberName: memberName,
        gender: gender?.toUpperCase(),
        birth: birth.split(".").join("-"),
        level: getApiLevel(level),
        // imgKey: "",
        keywords: mappedKeywords,
      };
      axios.post("/api/my/details", body);
      if (!onboarding) {
        navigate("/group/making/member");
      } else {
        navigate("/onboarding/confirm/start");
      }
    },
    onSuccess: ({ data }: onBoardingRequestDto) => {
      console.log(data);
      console.log("성공");
      navigate("/confirm");
    },
    onError: err => {
      console.log(err);
    },
  });

  return (
    <div
      className="w-full flex flex-col -mb-8 -mt-14"
      style={{ minHeight: "100dvh" }}
    >
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
          <img src={KittyImg} alt="프로필 이미지" className="size-40" />
        </div>
        <div className="flex flex-wrap gap-[0.625rem] items-center justify-center">
          {tagMap.map(item => {
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
        className="flex items-center justify-center header-h4 mb-5 lg:mb-4"
        onClick={() => handleSubmitForm.mutate()}
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
