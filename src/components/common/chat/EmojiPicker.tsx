// 채팅 이모티콘 3x3 그리드
import React from "react";

type Props = {
  emojis: { name: string; url: string }[];
  onSelect: (url: string) => void;
};

const EmojiPicker: React.FC<Props> = ({ emojis, onSelect }) => {
  return (
    <div className="w-full bg-white px-4 py-4 ">
      <div className="grid grid-cols-3 gap-[1.25rem] max-h-[17rem] overflow-y-auto [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
        {emojis.map((e, i) => (
          <button
            key={i}
            onClick={() => onSelect(e.url)}
            aria-label={e.name}
            className="
              w-[6.25rem] h-[6.25rem]
              rounded-2xl bg-gy-50
              flex items-center justify-center
              active:scale-[0.98] transition
              overflow-hidden
            "
          >
            {/* 이미지 여백 조금 주기 */}
            <img
              src={e.url}
              alt={e.name}
              className="max-w-[5.5rem] max-h-[5.5rem] object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
