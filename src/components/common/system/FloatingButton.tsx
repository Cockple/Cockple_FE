import clsx from "clsx";

interface FloatingButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "M" | "L";
  color?: "white" | "green";
  icon: string;
  iconSize?: string;
  shadow?: boolean;
}

export const FloatingButton = ({
  size = "M",
  color = "white",
  shadow = true,
  icon,
  iconSize,
  className,
  ...reset
}: FloatingButtonProps) => {
  return (
    <div
      className={clsx(
        `flex items-center justify-center cursor-pointer rounded-full`,
        size === "M" ? "w-11 h-11" : "w-13 h-13",
        color === "white" ? "bg-white active:bg-gy-100" : "bg-gr-500",
        shadow ? "shadow-ds200" : "",
        className,
      )}
      {...reset}
    >
      <img
        src={icon}
        alt="floating icon"
        className={clsx(iconSize ? iconSize : "w-6")}
      />
    </div>
  );
};
