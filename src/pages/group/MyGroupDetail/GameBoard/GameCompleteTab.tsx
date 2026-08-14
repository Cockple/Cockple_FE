import ImgNoneError from "@/assets/images/None_Error.webp?url";

export const GameCompleteTab = () => (
  <div className="flex flex-col items-center justify-center gap-5 pt-16">
    <img
      src={ImgNoneError}
      alt="준비 중"
      className="size-[11.25rem] object-contain"
    />
    <div className="header-h5 text-center">
      게임 완료 기능은 준비 중이에요!
    </div>
  </div>
);
