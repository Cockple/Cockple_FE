import type { MemberProps } from "@/components/common/contentcard/Member";
import Message from "@/assets/icons/message.svg?react";
import MemberInfo from "./MemberInfo";
import ProfileImage from "@/assets/images/base_profile_img.png";

const MemberCard = ({
  member,
  onMessageClick,
}: {
  member: MemberProps;
  onMessageClick: () => void;
}) => {
  return (
    <div className="w-full h-[4.75rem] bg-white px-4 py-2 flex items-center gap-3 border-b border-gy-200">
      <img src={ProfileImage} alt="프로필" className="w-[2.5rem] h-[2.5rem] rounded-full object-cover" />
      <MemberInfo {...member} />
      <Message
        className="w-[2rem] h-[2rem] ml-auto cursor-pointer"
        onClick={onMessageClick}
      />
    </div>
  );
};
export default MemberCard;
