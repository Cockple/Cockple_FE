import Dismiss from "@/assets/icons/dismiss.svg";
import EmojiSurprise from "@/assets/icons/emoji_surprise.svg";

interface GameRandomMatchFailModalProps {
  onClose: () => void;
}

// 랜덤(자동) 매칭 실패 시 노출되는 안내 모달
export const GameRandomMatchFailModal = ({
  onClose,
}: GameRandomMatchFailModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
    onClick={onClose}
  >
    <div
      className="flex w-[21.4375rem] flex-col items-center gap-5 rounded-2xl bg-white p-3 shadow-ds300"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex w-full items-center justify-between">
        <div className="size-8" />
        <button
          type="button"
          className="flex items-center rounded-lg p-1"
          onClick={onClose}
        >
          <img src={Dismiss} alt="닫기" className="size-6" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <img src={EmojiSurprise} alt="" className="size-8" />
        <span className="header-h4 text-black">매칭 실패</span>
        <span className="body-rg-500 text-center text-black">
          매칭에 실패했습니다. 명단을 확인해주세요.
        </span>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center rounded-lg border border-rd-500 px-4 py-2 body-rg-500 text-rd-500"
        onClick={onClose}
      >
        뒤로가기
      </button>
    </div>
  </div>
);
