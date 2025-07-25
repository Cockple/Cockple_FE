import clsx from "clsx";

interface MultiSelectButtonGroupProps {
  options: string[];
  selected: string[] | string;
  onChange: (select: string[] | string) => void;
  singleSelect?: boolean;
}

export const MultiSelectButtonGroup = ({
  options,
  selected,
  onChange,
  singleSelect = false,
}: MultiSelectButtonGroupProps) => {
  const isArray = Array.isArray(selected);
  const toggleOption = (option: string) => {
    if (singleSelect) {
      onChange(option);
    } else if (isArray) {
      if (selected.includes(option)) {
        onChange(selected.filter(item => item !== option));
      } else {
        onChange([...selected, option]);
      }
    }
  };

  const isSelected = (option: string) =>
    isArray ? selected.includes(option) : selected === option;

  return (
    <div className="flex flex-wrap gap-3">
      {options.map(option => (
        <button
          key={option}
          onClick={() => toggleOption(option)}
          className={clsx(
            "w-18.5 h-9.5 border-hard border-1 bg-white body-rg-500",
            isSelected(option)
              ? "border-gr-600 shadow-ds200-gr"
              : "border-gy-100 shadow-ds100",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
