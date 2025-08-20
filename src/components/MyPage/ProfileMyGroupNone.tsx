//내 모임이 없을 경우에 나오는 컴포넌트입니다.
import NoneImg from "../../assets/images/None_Error.png";

export const ProfileMyGroupNone = () => {
  return (
      <div className="flex flex-col items-center gap-8">
        <img src={NoneImg} className="w-[11.25rem] h-[11.25rem] object-contain" />
        <div className="flex flex-col items-center ">
          <p className="header-h5">참여중인 모임이 없어요!</p>
        </div>
    </div>
  );
};
