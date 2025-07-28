import { useState } from "react";

interface InputSliderProps {
  title: string;
}

export default function InputSlider({ title }: InputSliderProps) {
  const currentYear = new Date().getFullYear();

  const minYear = currentYear - 75;
  const maxYear = currentYear - 10;
  const [range, setRange] = useState<[number, number]>([minYear, maxYear]);

  const handleChange = (value: number, index: number) => {
    // 최소/최대 범위가 서로 엇갈리지 않게 보정
    if (index === 0 && value >= range[1]) return;
    if (index === 1 && value <= range[0]) return;
    const newRange = [...range] as [number, number];
    newRange[index] = value;
    setRange(newRange);
  };
  return (
    <div>
      <div className=" flex items-center mb-2 justify-between">
        <div className="flex px-1 gap-[2px] items-center">
          <p className="header-h5">{title}</p>
          <img src="/src/assets/icons/cicle_s_red.svg" alt="icon-cicle" />
        </div>
        <p className="body-rg-500">
          {range[0]} ~ {range[1]}년생
        </p>
      </div>

      {/* 슬라이더 */}
      <div className="relative h-6">
        {/* Custom slider bar */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gy-100 rounded-full -translate-y-1/2" />
        <div
          className="absolute top-1/2 h-1 bg-gr-600 rounded-full -translate-y-1/2"
          style={{
            left: `${((range[0] - minYear) / (maxYear - minYear)) * 100}%`,
            width: `${((range[1] - range[0]) / (maxYear - minYear)) * 100}%`,
          }}
        />

        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={range[0]}
          onChange={e => handleChange(Number(e.target.value), 0)}
          className="absolute w-full h-6 bg-transparent appearance-none pointer-events-auto z-10"
          style={{
            pointerEvents: range[0] === range[1] - 1 ? "none" : "auto",
          }}
        />

        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={range[1]}
          onChange={e => handleChange(Number(e.target.value), 1)}
          className="absolute w-full h-6 bg-transparent appearance-none pointer-events-auto z-20"
        />
      </div>
    </div>
  );
}
