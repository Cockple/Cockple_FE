import Dismiss from "@/assets/icons/dismiss.svg";
import ExerciseFilled from "@/assets/icons/Exercise_filled.svg";

interface GameEndModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const GameEndModal = ({ onClose, onConfirm }: GameEndModalProps) => (
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

      <div className="flex flex-col items-center gap-2 px-2 pb-1">
        <img src={ExerciseFilled} alt="" className="size-8" />
        <span className="header-h4 text-black">게임을 완료하시겠어요?</span>
        <span className="body-rg-500 text-center text-black">
          완료한 게임은 '게임 완료' 탭에서 확인할 수 있어요.
        </span>
      </div>

      <button
        type="button"
        className="flex w-[10.3125rem] items-center justify-center rounded-lg border border-gr-600 px-4 py-2 body-rg-500 text-gr-600"
        onClick={onConfirm}
      >
        종료하기
      </button>
    </div>
  </div>
);
