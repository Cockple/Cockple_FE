import LogoIcon from "@/assets/icons/Logo.svg";
import Alert from "@/assets/icons/alert.svg";
import AlertNoti from "@/assets/icons/alert_noti.svg";
import clsx from "clsx";
import DropDownBtn from "../../DynamicBtn/DropDownBtn";
import { useNavigate } from "react-router-dom";

interface MainHeaderProps {
  hasNotification?: boolean;
  background?: "white" | "clear";
  className?: string;
}

export const MainHeader = ({
  hasNotification,
  background = "white",
  className,
}: MainHeaderProps) => {
  const navigate = useNavigate();
  const alertIcon = hasNotification ? AlertNoti : Alert;

  return (
    <div
      className={clsx(
        "fixed z-10 top-0 flex w-full max-w-[444px] -ml-4 justify-between items-center px-4 h-14 transition-all duration-500",
        background === "white" ? "bg-white" : "bg-transparent",
        className,
      )}
    >
      <img src={LogoIcon} className="w-15" alt="Cockple Logo" />

      <div className="flex gap-3">
        <DropDownBtn>
          <span
            className="header-h4"
            onClick={() => navigate("/edit/location")}
          >
            사1동
          </span>
        </DropDownBtn>

        <button type="button" className="p-1">
          <img
            src={alertIcon}
            className="w-6 cursor-pointer"
            alt="alert icon"
          />
        </button>
      </div>
    </div>
  );
};
