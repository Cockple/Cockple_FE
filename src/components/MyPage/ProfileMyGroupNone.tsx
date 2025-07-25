//내 모임이 없을 경우에 나오는 컴포넌트입니다.
import Logo from "../../assets/icons/Logo_Typo.svg?react";

export const ProfileMyGroupNone = () => {
  return (
    // <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)] px-4">
    // <div className="w-full h-[352px] flex flex-col items-center justify-center mt-10">
      <div className="flex flex-col items-center gap-8">
        {/* 임티인데 아직 안 나와서 로고로... */}
        <Logo className="w-44 h-44 mt-[32px]" />
        <div className="flex flex-col items-center ">
          <p className="header-h5">참여중인 모임이 없어요!</p>
        </div>
    </div>
  );
};
