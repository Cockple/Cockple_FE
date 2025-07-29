import { Range } from "react-range";
interface InputSliderProps {
  title: string;
  minYear: number;
  maxYear: number;
  values: number[];
  onChange: (values: number[]) => void;
}

export default function InputSlider({
  title,
  minYear,
  maxYear,
  values,
  onChange,
}: InputSliderProps) {
  return (
    <div>
      <div className=" flex items-center mb-2 justify-between">
        <div className="flex px-1 gap-[2px] items-center">
          <p className="header-h5">{title}</p>
          <img src="/src/assets/icons/cicle_s_red.svg" alt="icon-cicle" />
        </div>
        <p className="body-rg-500">
          {values[0]} ~ {values[1]}년생
        </p>
      </div>
      <Range
        step={1}
        min={minYear}
        max={maxYear}
        values={values}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 bg-gray-200 relative rounded-full mx-2"
          >
            <div
              className="absolute h-1 bg-gr-600 rounded-full "
              style={{
                left: `${((values[0] - minYear) / (maxYear - minYear)) * 100}%`,
                width: `${((values[1] - values[0]) / (maxYear - minYear)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-4 h-4 bg-green-600 border-white border-2 rounded-full shadow-md cursor-default"
          />
        )}
      />
    </div>
  );
}
