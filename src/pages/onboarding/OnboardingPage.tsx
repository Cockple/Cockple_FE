import { useNavigate } from "react-router-dom";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import IntroText from "../../components/onboarding/IntroText";
import ProfileImg from "@/assets/images/base_profile_img.png?url";
import useUserStore from "../../store/useUserStore";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  return (
    <>
      <div className=" w-full flex flex-col justify-center -mb-8 min-h-dvh">
        <section className="flex items-center flex-col gap-25 flex-1">
          <IntroText
            title="환영합니다!"
            text1="카카오 계정으로 가입되었어요"
            text2="회원 정보를 입력하고 콕플을 즐겨볼까요?"
            isBar={false}
          />
          <div>
            <img
              src={ProfileImg}
              alt="프로필 이미지"
              className="size-25 mb-5"
            />
            <p className="header-h4">{user?.nickname}</p>
          </div>
        </section>
        <div
          className="flex items-center justify-center header-h4 mb-6  "
          onClick={() => navigate("info")}
        >
          <Btn_Static label="회원 정보 입력" kind="GR400" size="L" />
        </div>
      </div>
    </>
  );
};
