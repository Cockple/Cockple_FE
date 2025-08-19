import { useNavigate } from "react-router-dom";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import IntroText from "../../components/onboarding/IntroText";
import medal1 from "@/assets/icons/medal_1.svg";
import medal2 from "@/assets/icons/medal_2.svg";
import medal3 from "@/assets/icons/medal_3.svg";
import AddIcon from "@/assets/icons/add.svg";

export const OnboardingConfirmStartPage = () => {
  const navigate = useNavigate();
  const MEDAL = [
    { label: "금메달", icon: medal1 },
    {
      label: "은메달",
      icon: medal2,
    },
    {
      label: "동메달",
      icon: medal3,
    },
  ];
  return (
    <div className="w-full  flex flex-col -mb-8 pt-14 min-h-dvh">
      <section className="flex items-center flex-col  gap-15 flex-1 ">
        <IntroText
          title="입상 기록이 나를 더 잘 보여줄거에요!"
          text1="마이페이지에서 대회 경력을 등록해보세요."
          isBar={true}
          className="pt-9 items-stretch text-left  w-full"
        />
        {/* 끊고 */}
        <div className="flex gap-8 flex-col items-center">
          <div className="flex shadow-ds200-gr rounded-lg bg-white py-1 px-4 gap-1 items-center justify-center body-rg-500">
            <p>지금까지</p>
            <p className="text-gr-700">??</p>
            <p>개의 메달을 모았어요</p>
          </div>

          <div className="flex gap-5">
            {MEDAL.map(item => {
              return (
                <>
                  <div className="flex gap-3 py-2 flex-col">
                    <img src={item.icon} alt={item.label} className="size-15" />
                    <p>{item.label}</p>
                  </div>
                </>
              );
            })}
          </div>

          <button
            className="flex py-2 px-4 rounded-lg gap-2 items-center justify-center bg-gy-100 cursor-pointer"
            onClick={() => navigate("/mypage/mymedal/add")}
          >
            <img src={AddIcon} alt="" />
            대회기록 추가하기
          </button>
        </div>
      </section>
      <div
        className="flex items-center justify-center header-h4 mb-6"
        onClick={() => navigate("/")}
      >
        <Btn_Static label="시작하기" kind="GR400" size="L" />
      </div>
    </div>
  );
};
