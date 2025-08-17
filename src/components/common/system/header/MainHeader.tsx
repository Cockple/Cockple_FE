import LogoIcon from "@/assets/icons/Logo.svg?url";
import Alert from "@/assets/icons/alert.svg?url";
import AlertNoti from "@/assets/icons/alert_noti.svg?url";
import clsx from "clsx";
import DropDownBtn from "../../DynamicBtn/DropDownBtn";
import { useNavigate } from "react-router-dom";
import {
  getMyLocation,
  type MyLocationType,
} from "../../../../api/member/getMyLocation";
import { useEffect, useState } from "react";
import api from "../../../../api/api";

interface MainHeaderProps {
  background?: "white" | "clear";
  className?: string;
}

export const MainHeader = ({
  background = "white",
  className,
}: MainHeaderProps) => {
  const navigate = useNavigate();
  const [hasNotification, setHasNotification] = useState(false);
  const alertIcon = hasNotification ? AlertNoti : Alert;
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchMyLocation = async () => {
      const data: MyLocationType = await getMyLocation();
      setLocation(data.addr3 ?? data.buildingName);
    };

    fetchMyLocation();
  }, []);

  const getNotificationsCount = async () => {
    try {
      const { data } = await api.get("/api/notifications/count");

      setHasNotification(data.data.existNewNotification);
    } catch (err) {
      console.log("알람 존재여부 api 오류: ", err);
    }
  };

  useEffect(() => {
    getNotificationsCount();
  }, []);

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
        <DropDownBtn onClick={() => navigate("/edit/location")}>
          <span className="header-h4">{location}</span>
        </DropDownBtn>

        <button
          type="button"
          className="p-1"
          onClick={() => navigate("/alert")}
        >
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
