import { useNavigate } from "react-router-dom";
import ArrowLeft from "@/assets/icons/arrow_left.svg";
import MeetBall from "@/assets/icons/meetball.svg";
import clsx from "clsx";

interface PageHeaderProps {
  title: string;
  onBackClick?: () => void;
  onMoreClick?: () => void;
  className?: string;
}

export const PageHeader = ({
  title,
  onBackClick,
  onMoreClick,
  className,
}: PageHeaderProps) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };
  return (
    <div
      className={clsx(
        "fixed top-0 left-1/2 -translate-x-1/2 px-4 flex items-center justify-between gap-3 w-full max-w-[444px] h-14 bg-white z-40",
        className,
      )}
    >
      <button type="button" className="p-1">
        <img
          src={ArrowLeft}
          className="w-6"
          alt="arrow_left"
          onClick={handleBackClick}
        />
      </button>

      <div className="flex justify-start flex-1 header-h4">{title}</div>

      {onMoreClick && (
        <button type="button" className="p-1" onClick={onMoreClick}>
          <img src={MeetBall} className="w-6" alt="meetball icon" />
        </button>
      )}
    </div>
  );
};
