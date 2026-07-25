import clsx from "clsx";

export interface NavItemProps {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  showDot?: boolean;
}

export const NavItem = ({
  label,
  icon,
  active,
  onClick,
  showDot = false,
}: NavItemProps) => {
  return (
    <button
      className="flex flex-col items-center gap-2 py-2 w-16 border-hard active:bg-gray-100"
      onClick={onClick}
    >
      <span className="relative inline-flex">
        <img
          src={icon}
          alt={`icon-${label}`}
          className={clsx("w-6 h-6", active ? "-gr-700" : "")}
        />
        {showDot && (
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#F62D2D]" />
        )}
      </span>
      <span className={clsx("body-sm-500", active ? "text-gr-700" : "")}>
        {label}
      </span>
    </button>
  );
};
