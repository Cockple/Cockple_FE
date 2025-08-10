import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";

const MemberInfo = ({
  name,
  gender,
  level,
  isGuest = false,
  guestName,
}: {
  name: string;
  gender: "MALE" | "FEMALE";
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
        {gender === "FEMALE" ? (
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

export default MemberInfo;
