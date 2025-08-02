import clsx from "clsx";

interface SlideSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const SlideSwitch = ({
  checked,
  onChange,
  disabled,
}: SlideSwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={clsx(
        "w-10 h-6 p-0.5 border-round relative inline-flex items-center justify-between transition-colors shadow-is50",
        checked ? "bg-green-500" : "bg-gy-400",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <span
        className={clsx(
          "absolute h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "right-0.5" : "left-0.5",
        )}
      />
    </button>
  );
};
