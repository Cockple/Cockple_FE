//메인 채팅 페이지 검색바
import React from "react";
import Search from "../../assets/icons/search.svg";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ value, onChange }: Props) => (
  <div className="relative w-full h-[2.75rem] gap-2">
    <input
      type="text"
      placeholder="모임명으로 검색"
      className="w-full h-full pl-[0.625rem] pr-[2.5rem] rounded-[0.75rem] header-h5 placeholder:text-gy-400 border border-gy-400"
      value={value}
      onChange={onChange}
    />
    <img
      src={Search}
      alt="search"
      className="absolute right-[0.75rem] top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
    />
  </div>
);

export default SearchInput;
