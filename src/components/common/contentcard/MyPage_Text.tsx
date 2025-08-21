import Arrow_right_GY from "../../../assets/icons/arrow_right_GY.svg?react";
import Arrow_right from "../../../assets/icons/arrow_right.svg?react";

interface MyPageProps {
  textLabel?: string;
  numberValue?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export const MyPage_Text = ({
  textLabel = "Text",
  numberValue,
  disabled = false,
  onClick,
}: MyPageProps) => {
  const bgColor = disabled ? "bg-white" : "bg-white active:bg-[#F4F5F6]";
  const textColor = disabled ? "text-[#C0C4CD]" : "text-black";
  const numberColor = disabled ? "text-[#C0C4CD]" : "text-[#0A7456]";
  const cursorStyle = disabled
    ? "cursor-not-allowed pointer-events-none"
    : "cursor-pointer";
  const ArrowIcon = disabled ? Arrow_right_GY : Arrow_right;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`w-[21.4375rem] h-[3rem] px-[0.75rem] py-[1rem] shadow-ds100 rounded-[1rem] flex items-center justify-between ${bgColor} ${cursorStyle} transition duration-200`}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <div className="flex items-center gap-[0.5rem]">
        <p className={`header-h5 ${textColor}`}>{textLabel}</p>
        <p className={`header-h5 ${numberColor}`}>{numberValue}</p>
      </div>
      <ArrowIcon className="w-[1rem] h-[1rem]" />
    </div>
  );
};
