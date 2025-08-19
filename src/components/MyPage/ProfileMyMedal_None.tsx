import NoneImg from "../../assets/images/None_Error.png";

export const ProfileMyMedal_None = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <img src={NoneImg} className="w-[11.25rem] h-[11.25rem] object-contain" />
      <p className="header-h5">대회 기록이 없어요!</p>
    </div>
  );
};
