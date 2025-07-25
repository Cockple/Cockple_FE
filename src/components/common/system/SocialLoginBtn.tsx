import KakaoLogo from "@/assets/icons/kakao.svg";

export const SocialLoginBtn = () => {
  return (
    <div className="flex items-center border-hard w-86 h-12 bg-[#fee500] px-4 py-3 cursor-pointer">
      <img src={KakaoLogo} className="w-5" alt="kakao logo" />

      <div className="flex-1 header-h5">카카오 로그인</div>
    </div>
  );
};
