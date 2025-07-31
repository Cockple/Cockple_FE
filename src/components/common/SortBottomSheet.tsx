import CheckIcon from "@/assets/icons/check.svg";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import clsx from "clsx";

interface SortBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (option: string) => void;
  options?: string[];
  className?: string;
}

const defaultOptions = ["최신순", "참여 인원 많은 순"];

export const SortBottomSheet = ({
  isOpen,
  onClose,
  selected,
  onSelect,
  options = defaultOptions,
  className,
}: SortBottomSheetProps) => {
  useLockBodyScroll(isOpen);

  if (!isOpen) return;
  return (
    <div
      className={clsx(
        "fixed bottom-0 bg-black/20 -mx-4 w-full max-w-[444px] h-full z-70",
        className,
      )}
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 flex flex-col gap-1 w-full max-w-[444px] px-4 pt-4 pb-8 bg-white rounded-t-3xl"
        onClick={e => e.stopPropagation()}
      >
        {options.map(option => (
          <div
            key={option}
            className="flex items-center w-full h-14 justify-between p-3 active:bg-gy-100"
            onClick={() => {
              onSelect(option);
              onClose();
            }}
          >
            {option}
            {selected === option && <img src={CheckIcon} alt="check icon" />}
          </div>
        ))}
      </div>
    </div>
  );
};
