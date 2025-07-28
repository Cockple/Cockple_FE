// components/Btn_Static/Text/RD500_M.tsx
import ArrowLeft from "../../../../assets/icons/arrow_left.svg";
import ArrowLeftGY400 from "../../../../assets/icons/arrow_left-gy-400.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface ClearMProps {
  initialStatus?: BtnStatus;
  onClick?: () => void;
  iconMap?: Partial<Record<BtnStatus, string>>; // 상태별 아이콘
}

const Clear_M = ({
  initialStatus = "default",
  onClick,
  iconMap,
}: ClearMProps) => {
  // const [status, setStatus] = useState<BtnStatus>(initialStatus);
  const currentIcon = iconMap?.[initialStatus];

  const isDisabled = initialStatus === "disabled";

  // const handleMouseDown = () => {
  //   if (!isDisabled) setStatus("pressing");
  // };

  // const handleMouseUp = () => {
  //   if (!isDisabled && status === "pressing") {
  //     setStatus("clicked");
  //     onClick?.();
  //   }
  // };

  const getBg = () => {
    switch (initialStatus) {
      case "pressing":
        return "bg-gy-100";
      case "disabled":
      case "default":
      case "clicked":
      default:
    }
  };

  const getIcon = () => {
    switch (initialStatus) {
      case "disabled":
        return ArrowLeftGY400;
      default:
        return ArrowLeft;
    }
  };

  return (
    <button
      className={`
        inline-flex p-1 items-center gap-3 border-hard 
        ${getBg()} 
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={status === "disabled"}
      // onMouseDown={handleMouseDown}
      // onMouseUp={handleMouseUp}
      onClick={() => {
        if (!isDisabled) onClick?.();
      }}
    >
      <img
        src={`${currentIcon ? currentIcon : getIcon()}`}
        alt="icon"
        className="w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem] aspect-square"
      />
    </button>
  );
};

export default Clear_M;
