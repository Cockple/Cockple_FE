import { useState, useEffect } from "react";
import Female from "../../assets/icons/female.svg?react";
import Male from "../../assets/icons/male.svg?react";

interface ProfileProps {
  name: string;
  gender: "female" | "male";
  level: string;
  birth?: string;
  profileImage: File | string | null | undefined;
}

export const Profile = ({
  name,
  gender,
  level,
  birth,
  profileImage,
}: ProfileProps) => {

  //이미지 File로 받기 위한 처리부분
  const [imageUrl, setImageUrl] = useState<string>("");
  useEffect(() => {
    if (profileImage instanceof File) {
      const objectUrl = URL.createObjectURL(profileImage);
      setImageUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (typeof profileImage === "string") {
      setImageUrl(profileImage);
    } else {
      setImageUrl("/default-profile.png");
    }
  }, [profileImage]);



  return (
    <div className="w-[21.44rem] h-[4.75rem] bg-white rounded-[1rem] px-4 py-2 flex items-center gap-[0.8125rem]">
      <img
        src={imageUrl || "/default-profile.png"}
        alt="프로필 이미지"
        className="w-[4.75rem] h-[4.75rem] rounded-full object-cover"
      />

      <div className="flex flex-col justify-center gap-[0.25rem]">
        <div className="flex items-center gap-1">
          <p className="header-h5 text-black">{name}</p>
          {gender === "female" ? (
            <Female className="w-[1rem] h-[1rem]" />
          ) : (
            <Male className="w-[1rem] h-[1rem]" />
          )}
        </div>
        <div className="flex items-center gap-[0.25rem] body-sm-500">
          <p className="whitespace-nowrap">{level}</p>
          {birth && (
            <>
              <span className="text-[#D6DAE0]">|</span>
              <p className="truncate overflow-hidden whitespace-nowrap max-w-[5rem]">
                {birth}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
