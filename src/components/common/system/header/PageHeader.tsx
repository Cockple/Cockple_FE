import { useNavigate } from "react-router-dom";
import ArrowLeft from "@/assets/icons/arrow_left.svg";
import MeetBall from "@/assets/icons/meetball.svg";

interface PageHeaderProps {
  title: string;
  onBackClick?: () => void;
  onMoreClick?: () => void;
}

export const PageHeader = ({
  title,
  onBackClick,
  onMoreClick,
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
    <div className="flex items-center justify-between gap-3 w-full px-4">
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
