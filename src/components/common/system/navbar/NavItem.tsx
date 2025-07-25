import clsx from "clsx";

export interface NavItemProps {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}

export const NavItem = ({ label, icon, active, onClick }: NavItemProps) => {
  return (
    <button
      className="flex flex-col items-center gap-2 py-2 w-16 border-hard active:bg-gray-100"
      onClick={onClick}
    >
      <img
        src={icon}
        alt={`icon-${label}`}
        className={clsx("w-6 h-6", active ? "-gr-700" : "")}
      />
      <span className={clsx("body-sm-500", active ? "text-gr-700" : "")}>
        {label}
      </span>
    </button>
  );
};
