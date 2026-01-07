import { useRef } from "react";
import BaseProfileImg from "@/assets/images/base_profile_img.png?url";
import Camer_gy_400 from "@/assets/icons/camera_gy_400.svg?react";

interface Props {
  image: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileImageSection = ({ image, onImageChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onProfileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-8 relative">
      <img
        src={image || BaseProfileImg}
        alt="profile"
        className="w-24 h-24 rounded-full object-cover cursor-pointer"
        onClick={onProfileClick}
      />
      <div className="absolute bottom-0 right-[calc(50%-40px)] bg-white shadow-ds100 rounded-full p-1 pointer-events-none">
        <Camer_gy_400 className="w-4 h-4" />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={onImageChange}
      />
    </div>
  );
};