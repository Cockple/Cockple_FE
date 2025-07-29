import type { UseFormRegisterReturn } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import SearchFieldBtn from "./Search_Filed/SearchFieldBtn";

interface LocationFieldProps {
  register?: UseFormRegisterReturn;
  showLabel?: boolean;
  label?: string;
}

export const LocationField = ({
  register,
  label,
  showLabel = true,
}: LocationFieldProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate("/location/search", {
      state: {
        returnPath: location.pathname,
      },
    });
  };
  return (
    <>
      <div className="text-left flex flex-col gap-2">
        {showLabel && (
          <div className="flex px-1 gap-[2px] items-center">
            <p className="header-h5">{label}</p>
            <img src="/src/assets/icons/cicle_s_red.svg" alt="icon-cicle" />
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
            <img
              src="/src/assets/icons/search.svg"
              alt="검색"
              className="size-6"
            />
          </button>
        </div>
        <div className="flex items-center justify-center ">
          <SearchFieldBtn onClick={handleClick} />
        </div>
      </div>
    </>
  );
};
