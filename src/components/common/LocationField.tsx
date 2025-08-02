import type { UseFormRegisterReturn } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import SearchFieldBtn from "./Search_Filed/SearchFieldBtn";
import Circle_Red from "@/assets/icons/cicle_s_red.svg?url";
import SearchIcon from "@/assets/icons/search.svg?url";

interface LocationFieldProps {
  register?: UseFormRegisterReturn;
  showLabel?: boolean;
  label: string;
  icon?: boolean;
  returnPath?: string;
  mode?: "fill-only" | "call-api";
}

export const LocationField = ({
  register,
  label,
  showLabel = true,
  icon = true,
  mode = "fill-only",
  returnPath,
}: LocationFieldProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate("/location/search", {
      state: {
        returnPath: returnPath || location.pathname,
        mode,
      },
    });
  };
  return (
    <>
      <div className="text-left flex flex-col gap-2">
        {showLabel && (
          <div className="flex px-1 gap-[2px] items-center">
            <p className="header-h5">{label}</p>
            {icon && <img src={Circle_Red} alt="icon-circle" />}
          </div>
        )}

        <div className="relative ">
          <input
            type="text"
            className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none cursor-pointer placeholder:text-gy-400"
            placeholder="건물명,도로명으로 검색"
            {...register}
            readOnly
            onClick={handleClick}
          />
          <button className="cursor-pointer absolute right-2 top-3">
            <img src={SearchIcon} alt="검색" className="size-6" />
          </button>
        </div>
        <div className="flex items-center justify-center ">
          <SearchFieldBtn onClick={handleClick} />
        </div>
      </div>
    </>
  );
};
