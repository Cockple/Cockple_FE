import clsx from "clsx";

interface ProgressBarProps {
  width: string;
  className?: string;
}

export const ProgressBar = ({ width, className }: ProgressBarProps) => {
  return (
    <div className=" -ml-4">
      <div
        className={clsx("h-1 bg-gr-500  rounded-r-lg", className)}
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};
