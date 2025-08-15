import Emoji from "@/assets/icons/emoji_surprise.svg";
import { ModalBar } from "../common/system/ModalBar";
import Btn_Static from "../common/Btn_Static/Btn_Static";

interface CautionModalLocationProps {
  onClick?: () => void;
  onclose?: () => void;
}

export const CautionModalLocation = ({
  onClick,
  onclose,
}: CautionModalLocationProps) => {
  return (
    <div className="flex justify-center items-center fixed bottom-0 bg-black/20 -mx-4 w-full max-w-[444px] h-full z-50">
      <div className="w-86 h-63 p-3 bg-white shadow-ds200 border-round">
        <ModalBar onClick={onclose} />
        <div className="flex flex-col gap-vertical-section-s">
          <div className="flex flex-col justify-center items-center gap-2">
            <img src={Emoji} alt="emogi_surprise" className="w-8 h-8" />
            <div className="header-h4 text-black">정말 떠나시겠어요?</div>
            <div className="flex flex-col gap-1 body-rg-500">
              <span>등록된 위치를 삭제해주세요!</span>

              <div className="flex flex-col">
                <span>최대 5개까지 저장 가능합니다.</span>
                <span>수정 버튼을 눌러 위치 정보를 삭제해주세요</span>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <Btn_Static
            kind="GY800"
            size="S"
            label="수정하기"
            initialStatus="default"
            onClick={onClick}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
