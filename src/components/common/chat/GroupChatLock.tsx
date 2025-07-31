import Grad_Mix_L from "../Btn_Static/Text/Grad_Mix_L";
import LockIcon from "../../../assets/icons/lock_filled.svg";
import ChatBg from "../../../assets/images/groupChatPage.png"; // 캡처 이미지

interface GroupChatLockedViewProps {
  onJoin: () => void;
}

const GroupChatLockedView = ({ onJoin }: GroupChatLockedViewProps) => {
  return (
    <div
      className="relative flex flex-col min-h-[86dvh] -mb-8 -mt-4"
      style={{
        width: "calc(100% + 2rem)",
        marginLeft: "-1rem",
        marginRight: "-1rem",
      }}
    >
      {/* 배경 이미지 */}
      <div className="relative h-[72dvh] overflow-y-auto [&::-webkit-scrollbar]:hidden bg-white">
        <img
          src={ChatBg}
          alt="group chat background"
          className="h-full w-full object-cover blur-[var(--blur-bg)]"
        />

        {/* 오버레이 컨텐츠 */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
          {/* 자물쇠 + 안내 문구 */}
          <div className="flex flex-col items-center">
            <img src={LockIcon} alt="lock icon" className="w-10 h-10 mb-4" />
            <p className="header-h5 text-center">
              모임 채팅은 모임 멤버들에게만 공유됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 고정 */}
      <div className="flex mt-3">
        <Grad_Mix_L
          type="chat_question"
          label="모임 가입하기"
          onClick={onJoin}
          onImageClick={() => {}}
        />
      </div>
    </div>
  );
};

export default GroupChatLockedView;
