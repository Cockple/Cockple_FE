import { useState } from "react";
import clsx from "clsx";
import Dismiss from "@/assets/icons/dismiss.svg";
import Add from "@/assets/icons/add.svg";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import GR400_L from "@/components/common/Btn_Static/Text/GR400_L";
import GR400_M from "@/components/common/Btn_Static/Text/GR400_M";

export interface CourtManageItem {
  courtId?: number; // 있으면 기존 코트(이름 변경), 없으면 신규 생성
  courtName: string;
}

interface CourtManageBottomSheetProps {
  variant?: "sheet" | "overlay";
  courts: CourtManageItem[];
  onClose: () => void;
  onSave: (courts: CourtManageItem[]) => void;
}

export const CourtManageBottomSheet = ({
  variant = "sheet",
  courts,
  onClose,
  onSave,
}: CourtManageBottomSheetProps) => {
  useLockBodyScroll(true);
  const [items, setItems] = useState<CourtManageItem[]>(courts);
  const [newLabel, setNewLabel] = useState("");
  const [isNewLabelFocused, setIsNewLabelFocused] = useState(false);

  const handleAdd = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    setItems(prev => [...prev, { courtName: trimmed }]);
    setNewLabel("");
  };

  const handleRemove = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const trimmed = newLabel.trim();
    onSave(trimmed ? [...items, { courtName: trimmed }] : items);
    onClose();
  };

  const isOverlay = variant === "overlay";

  const content = (
    <>
      <span className="header-h5 text-black">코트 관리</span>

      <div className="flex w-full flex-col gap-2">
        {items.map((item, index) => (
          <div
            key={item.courtId ?? `new-${index}`}
            className="flex w-full items-center gap-2 rounded-xl border border-gy-200 px-3 py-2.5"
          >
            <span className="flex-1 truncate body-md-500 text-black">
              {item.courtName}
            </span>
            {index !== 0 && (
              <button type="button" onClick={() => handleRemove(index)}>
                <img src={Dismiss} alt="삭제" className="size-5" />
              </button>
            )}
          </div>
        ))}

        <div className="flex w-full flex-col gap-2">
          <input
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onFocus={() => setIsNewLabelFocused(true)}
            onBlur={() => setIsNewLabelFocused(false)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            className={clsx(
              "w-full rounded-xl border px-3 py-2.5 body-md-500 text-black outline-none",
              isNewLabelFocused ? "border-[#87c95e]" : "border-gy-200",
            )}
          />
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-gy-100 px-4 py-2 body-rg-500 text-black"
            onClick={handleAdd}
          >
            <img src={Add} alt="" className="size-4.5" />
            추가하기
          </button>
        </div>
      </div>

      <div className="flex w-full justify-center">
        {isOverlay ? (
          <GR400_M label="저장하기" onClick={handleSave} />
        ) : (
          <GR400_L label="저장하기" onClick={handleSave} />
        )}
      </div>
    </>
  );

  if (isOverlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
        onClick={onClose}
      >
        <div
          className="flex w-full max-w-[23.4375rem] flex-col items-center gap-5 rounded-3xl bg-white p-4"
          onClick={e => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-1/2 z-50 h-full w-full max-w-[444px] -translate-x-1/2 bg-black/20"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 left-1/2 flex w-full max-w-[444px] -translate-x-1/2 flex-col items-center gap-5 rounded-t-3xl bg-white px-4 pt-4 pb-10"
        onClick={e => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};
