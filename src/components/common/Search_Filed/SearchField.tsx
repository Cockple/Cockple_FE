import type { UseFormRegisterReturn } from "react-hook-form";
import SearchFieldBtn from "./SearchFieldBtn";

interface SearchFieldProps {
  register?: UseFormRegisterReturn;
  onSearchClick?: () => void; //검색과 input
  onCurrentLocationClick?: () => void; //현재 위치
  showLabel?: boolean;
  label?: string;
}
export default function SearchField({
  register,
  onSearchClick,
  onCurrentLocationClick,
  label,
  showLabel = true,
}: SearchFieldProps) {
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
            onClick={onSearchClick}
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
          <SearchFieldBtn onClick={onCurrentLocationClick} />
        </div>
      </div>
    </>
  );
}
