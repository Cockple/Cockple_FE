import TextIconBtnS from "../../DynamicBtn/TextIconBtnS";

interface AlertChangeProps {
  groupName: string;
  alertText: string;
  imageSrc: string;
  onClick: () => void;
}

const AlertChange = ({
  groupName,
  alertText,
  imageSrc,
  onClick,
}: AlertChangeProps) => {
  return (
    <div className="flex w-[21.4375rem] flex-col items-center justify-center gap-3 border-soft bg-white p-2">
      {/* 상단 정보 영역 */}
      <div className="flex w-full items-center gap-3">
        <img
          src={imageSrc}
          alt="Group"
          className="h-10 w-10 border-hard object-cover"
        />
        <div className="flex flex-col gap-1 text-left">
          <span className="body-rg-400 text-black">{groupName}</span>
          <span className="line-clamp-2 w-full self-stretch overflow-hidden body-rg-500 text-black">
            {alertText}
          </span>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex w-full justify-end">
        <TextIconBtnS children="상세보기" onClick={onClick} />
      </div>
    </div>
  );
};

export default AlertChange;
