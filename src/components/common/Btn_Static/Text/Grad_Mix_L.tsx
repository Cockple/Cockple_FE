import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

//delete 아이콘
import DeleteGY400 from "../../../../assets/icons/delete-gy-400.svg";
import DeleteRD500 from "../../../../assets/icons/delete-rd-500.svg";
import DeleteWhite from "../../../../assets/icons/delete-white.svg";

//refresh 아이콘
import RefreshGY400 from "../../../../assets/icons/refresh-gy-400.svg";
import Refresh from "../../../../assets/icons/refresh.svg";
import RefreshWhite from "../../../../assets/icons/refresh-white.svg";

//chatquestion 아이콘
import ChatQuestion from "../../../../assets/icons/chat_question.svg";

type GradMixType = "delete" | "refresh" | "chat_question";

interface GradMixLProps {
  type: GradMixType;
  label?: string;
  initialStatus?: BtnStatus;
  onClick?: () => void; // 오른쪽 버튼(Btn_Static)의 클릭 핸들러
  onImageClick?: () => void; // 왼쪽 이미지 버튼 클릭 핸들러
}

const Grad_Mix_L = ({
  type,
  label = "Btn",
  initialStatus = "default",
  onClick,
  onImageClick,
}: GradMixLProps) => {
  // 타입에 따라 왼쪽 버튼의 iconMap 반환
  const getIconMap = () => {
    switch (type) {
      case "delete":
        return {
          disabled: DeleteGY400,
          default: DeleteRD500,
          pressing: DeleteWhite,
          clicked: DeleteRD500,
        };
      case "refresh":
        return {
          disabled: RefreshGY400,
          default: Refresh,
          pressing: RefreshWhite,
          clicked: Refresh,
        };
      case "chat_question":
        return {
          disabled: ChatQuestion,
          default: ChatQuestion,
          pressing: ChatQuestion,
          clicked: ChatQuestion,
        };
    }
  };

  // 타입에 따라 kind나 스타일이 다를 경우
  const getLeftBtnKind = () => {
    switch (type) {
      case "delete":
        return "RD500";
      default:
        return "GY800";
    }
  };

  return (
    <div
      className="w-full h-[6rem] pt-[0.5rem] pr-[1rem] pb-[2.25rem] pl-[1rem] gap-[0.5625rem] flex justify-center"
      style={{
        background:
          "linear-gradient(180deg, rgba(252, 252, 255, 0) 0%, rgba(252, 252, 255, 0.8) 50%, #FCFCFF 90%)",
      }}
    >
      {/* 왼쪽 버튼 */}
      <Btn_Static
        kind={getLeftBtnKind()}
        size="M"
        iconMap={getIconMap()}
        initialStatus={initialStatus}
        width="w-[5rem]"
        shadow="shadow-ds100"
        onClick={onImageClick}
      />

      {/* 오른쪽 버튼 */}
      <Btn_Static
        kind="GR400"
        size="M"
        label={label}
        initialStatus={initialStatus}
        onClick={onClick}
      />
    </div>
  );
};

export default Grad_Mix_L;
