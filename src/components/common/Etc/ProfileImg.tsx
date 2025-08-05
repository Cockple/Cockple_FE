import ProfileEditImg from "@/assets/icons/img_Edit.svg";

interface ProfileImgProps {
  size?: "XL" | "L" | "M" | "S";
  src?: string;
  alt?: string;
  custom?: string; // 추가적인 커스텀 스타일
  edit?: boolean;
}

export default function ProfileImg({
  size = "XL",
  src = "/src/assets/images/base_profile_img.png",
  edit = false,
}: ProfileImgProps) {
  const sizeMap = {
    XL: "size-25", // 100px
    L: "size-19", // 76px
    M: "size-16", // 64px
    S: "size-10", // 40px
  };

  return (
    <>
      <div className=" flex items-center justify-center rounded-full ">
        <div className="relative">
          <img
            src={src}
            alt="프로필 이미지"
            className={`object-cover rounded-full ${sizeMap[size]}`}
          />
          {edit && (
            <img
              src={ProfileEditImg}
              alt="프로필 이미지 수정"
              className="absolute right-0 bottom-0 size-8"
            />
          )}
        </div>
      </div>
    </>
  );
}
