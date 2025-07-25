import { useNavigate } from "react-router-dom";
import GY800_S from "../../components/common/Btn_Static/Text/GY800_S";
import RD500_S from "../../components/common/Btn_Static/Text/RD500_S";
import { ModalBar } from "../../components/common/system/ModalBar";
import Emoji from "@/assets/icons/emoji_surprise.svg";
import {
  useExerciseFilterStore,
  type ExerciseFilterState,
  type FilterKey,
} from "../../store/useExerciseFilterStore";

interface CautionModalProps {
  onClose: () => void;
  initialFilter: Pick<ExerciseFilterState, FilterKey>;
}

export const CautionModal = ({ onClose, initialFilter }: CautionModalProps) => {
  const navigate = useNavigate();
  const setFilter = useExerciseFilterStore(state => state.setFilter);
  const handleBackAndReset = () => {
    (Object.keys(initialFilter) as (keyof typeof initialFilter)[]).forEach(
      key => {
        setFilter(key, initialFilter[key]);
      },
    );
    navigate(-1);
  };
  return (
    <div className="flex justify-center items-center fixed bottom-0 bg-black/20 -mx-4 w-full max-w-[444px] h-full">
      <div className="w-86 h-63 p-3 bg-white shadow-ds200 border-round">
        <ModalBar onClick={onClose} />
        <div className="flex flex-col gap-vertical-section-s">
          <div className="flex flex-col justify-center items-center gap-2">
            <img src={Emoji} alt="emogi_surprise" className="w-8 h-8" />
            <div className="header-h4 text-black">정말 떠나시겠어요?</div>
            <div className="flex flex-col gap-1 body-rg-500">
              <span>변경된 필터가 적용되지 않았어요.</span>

              <div className="flex flex-col">
                <span>'뒤로가기'를 선택하시면,</span>
                <span>새로운 모임 운동 추천 페이지로 이동합니다.</span>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <RD500_S label="뒤로가기" onClick={handleBackAndReset} />
            <GY800_S label="필터 수정하기" onClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};
