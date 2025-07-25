import { useEffect, useRef, useState } from "react";

interface PickerProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function Picker({
  options,
  selectedValue,
  onChange,
}: PickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);
  const itemHeight = 40; // 각 아이템의 높이 (px)

  const [containerHeight, setContainerHeight] = useState(208); // 초기값은 h-52 (Tailwind 기준)
  const paddingHeight = (containerHeight - itemHeight) / 2; // 중앙 정렬을 위한 패딩 계산

  // 컨테이너 높이 실시간 측정 (반응형 대응)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        if (newHeight !== containerHeight) {
          setContainerHeight(newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerHeight]);

  // 선택된 항목이 중앙에 오도록 스크롤 위치 설정
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selectedIndex = options.findIndex(option => option === selectedValue);
    if (selectedIndex === -1) return;

    isScrollingProgrammatically.current = true;
    container.scrollTop = selectedIndex * itemHeight;

    setTimeout(() => {
      isScrollingProgrammatically.current = false;
    }, 100);
  }, [selectedValue, options]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingProgrammatically.current) return;

    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / itemHeight);

    if (index >= 0 && index < options.length) {
      onChange(options[index]);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full h-52 overflow-y-scroll scrollbar-hide snap-y snap-mandatory rounded-lg text-center overscroll-contain"
    >
      {/* 위 패딩 */}
      <div style={{ height: `${paddingHeight}px` }} className="flex-shrink-0" />

      {options.map(option => (
        <div
          key={option}
          className={`flex items-center justify-center snap-center transition-colors duration-200 ${
            option === selectedValue ? "text-black " : "text-gray-300"
          }`}
          style={{ height: `${itemHeight}px` }}
        >
          {option}
        </div>
      ))}

      {/* 밑 패딩 */}
      <div style={{ height: `${paddingHeight}px` }} className="flex-shrink-0" />
    </div>
  );
}
