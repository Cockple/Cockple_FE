interface ProgressBarProps {
  width: string;
}

export const ProgressBar = ({ width }: ProgressBarProps) => {
  return (
    <div className=" -ml-4">
      <div
        className="h-1 bg-gr-500  rounded-r-lg"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};
