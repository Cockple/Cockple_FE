import clsx from "clsx";

interface MultiSelectButtonGroupProps {
  options: string[];
  selected: string[] | string;
  onChange: (select: string[] | string) => void;
  singleSelect?: boolean;
  allLabel?: string;
}

export const MultiSelectButtonGroup = ({
  options,
  selected,
  onChange,
  singleSelect = false,
  allLabel = "전체",
}: MultiSelectButtonGroupProps) => {
  const isArray = Array.isArray(selected);
  const isAllSelected = isArray && selected.includes(allLabel); //false
  const isSelected = (option: string) =>
    isArray ? selected.includes(option) : selected === option;
  const toggleOption = (option: string) => {
    if (singleSelect) {
      onChange(option);
      return;
    }
    if (!isArray) return;
    const sel = selected;

    if (option === allLabel) {
      if (sel.includes(allLabel)) {
        onChange([]);
      } else {
        onChange([allLabel]);
      }
      return;
    }
    if (sel.includes(option)) {
      onChange(sel.filter(v => v !== option));
    } else {
      const next = [...sel.filter(v => v !== allLabel), option];
      onChange(next);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map(option => {
        const disabled = isArray && isAllSelected && option !== allLabel;
        const selectedStyle = isSelected(option);

        return (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            disabled={disabled}
            className={clsx(
              "w-18.5 h-9.5 border-hard border-1 bg-white body-rg-500 rounded-lg",
              selectedStyle
                ? "border-gr-600 shadow-ds200-gr"
                : "border-gy-100 shadow-ds100",
              disabled && "opacity-50 pointer-events-none cursor-not-allowed",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
