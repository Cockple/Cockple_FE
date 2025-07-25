import React from "react";

interface AlertTest1Props {
  groupName: string;
  alertText: string;
  descriptionText: string;
  imageSrc: string;
}

const AlertTest1 = ({
  groupName,
  alertText,
  imageSrc,
  descriptionText,
}: AlertTest1Props) => {
  return (
    <div className="flex w-[21.4375rem] flex-col gap-3 border-soft bg-white p-2">
      {/* 상단 정보 영역 */}
      <div className="flex w-full gap-3">
        <img
          src={imageSrc}
          alt="Group"
          className="h-10 w-10 border-hard object-cover"
        />
        <div className="flex flex-col gap-1 text-left">
          <span className="body-rg-400 text-black">{groupName}</span>
          <div>
            <span className="line-clamp-2 w-full self-stretch overflow-hidden body-rg-500 text-black">
              {alertText}
            </span>
            <span className="line-clamp-2 w-full self-stretch overflow-hidden body-sm-500 text-[#9195a1]">
              {descriptionText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertTest1;
