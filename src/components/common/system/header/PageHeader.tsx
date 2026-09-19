import { useNavigate } from "react-router-dom";
import ArrowLeft from "@/assets/icons/arrow_left.svg";
import MeetBall from "@/assets/icons/meetball.svg";
import Refresh from "@/assets/icons/refresh.svg";
import clsx from "clsx";

interface PageHeaderProps {
  title: string;
  onBackClick?: () => void;
  onMoreClick?: () => void;
  onRefreshClick?: () => void;
  /** true면 새로고침 아이콘이 회전한다. */
  refreshing?: boolean;
  className?: string;
}

export const PageHeader = ({
  title,
  onBackClick,
  onMoreClick,
  onRefreshClick,
  refreshing = false,
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
      <button type="button" className="p-1 cursor-pointer">
        <img
          src={ArrowLeft}
          className="w-6"
          alt="arrow_left"
          onClick={handleBackClick}
        />
      </button>

      <div className="flex justify-start flex-1 header-h4">{title}</div>

      {onRefreshClick && (
        <button
          type="button"
          className="p-1 cursor-pointer disabled:cursor-default"
          onClick={onRefreshClick}
          disabled={refreshing}
          aria-label="새로고침"
        >
          <img
            src={Refresh}
            className={clsx("w-6", refreshing && "animate-spin")}
            alt="새로고침"
          />
        </button>
      )}

      {onMoreClick && (
        <button
          type="button"
          className="p-1 cursor-pointer"
          onClick={onMoreClick}
        >
          <img src={MeetBall} className="w-6" alt="meetball icon" />
        </button>
      )}
    </div>
  );
};
