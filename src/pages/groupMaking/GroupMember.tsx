import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import ProfileImage from "../../assets/icons/ProfileImage.svg?react";
import Female from "../../assets/icons/female.svg?react";
import Male from "../../assets/icons/male.svg?react";
import Message from "../../assets/icons/message.svg?react";

type MemberStatus =
  | "waiting"
  | "invite"
  | "request"
  | "approved"
  | "Participating";

interface MemberProps {
  name: string;
  gender: "male" | "female";
  level: string;
  birth?: string;
  status: MemberStatus;
}
const MemberInfo = ({
  name,
  gender,
  level,
  isGuest = false,
  guestName,
}: {
  name: string;
  gender: "male" | "female";
  level: string;
  isGuest?: boolean;
  guestName?: string;
  showStar?: boolean;
}) => {
  return (
    <div className="flex flex-col justify-center gap-[0.25rem] w-[9.75rem] h-[2.75rem]">
      <div className="flex items-center gap-1">
        <p className="header-h5 text-black">{name}</p>
      </div>
      <div className="flex items-center gap-[0.25rem] body-sm-500">
        {gender === "female" ? (
          <Female className="w-[1rem] h-[1rem]" />
        ) : (
          <Male className="w-[1rem] h-[1rem]" />
        )}
        <p className="whitespace-nowrap">{level}</p>
        {isGuest && (
          <>
            <span className="text-[#D6DAE0]">|</span>
            <p className="truncate overflow-hidden whitespace-nowrap max-w-[5rem]">
              {guestName}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const sampleMember: MemberProps = {
  name: "홍길동",
  gender: "male",
  level: "Lv.3",
  status: "approved",
};

export const GroupMember = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/group/1"); //임시 하드코딩
  };

  return (
    <>
      <div className="flex flex-col -mb-8">
        <PageHeader title="신규 멤버 추천" />
        <section className="text-left flex flex-col  gap-5 w-full mb-6 min-h-80">
          {/* 첫번째 */}
          <div className="relative mt-4">
            <input
              type="text"
              className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none cursor-pointer "
              placeholder="급수로 검색"
            />
            <button className="cursor-pointer absolute right-2 top-3">
              <img
                src="/src/assets/icons/search.svg"
                alt="검색"
                className="size-6"
              />
            </button>
          </div>
          {/* 두번째 */}
          <div>
            <div className="w-full h-[4.75rem] bg-white  px-4 py-2 flex items-center gap-3 border-b border-gy-200">
              <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
              <MemberInfo {...sampleMember} />
              <Message className="w-[2rem] h-[2rem] ml-auto" />
            </div>
            <div className="w-full h-[4.75rem] bg-white  px-4 py-2 flex items-center gap-3 border-b border-gy-200">
              <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
              <MemberInfo {...sampleMember} />
              <Message className="w-[2rem] h-[2rem] ml-auto" />
            </div>
            <div className="w-full h-[4.75rem] bg-white  px-4 py-2 flex items-center gap-3 border-b border-gy-200">
              <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
              <MemberInfo {...sampleMember} />
              <Message className="w-[2rem] h-[2rem] ml-auto" />
            </div>
          </div>
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-4 mt-38 shrink-0 `}
          onClick={handleNext}
        >
          <Btn_Static
            label="다음"
            kind="GR400"
            size="L"
            initialStatus={"default"}
          />
        </div>
      </div>
    </>
  );
};
