import Btn_Static from "../../common/Btn_Static/Btn_Static";
import AddIcon from "@/assets/icons/add.svg";

export const Empty = () => {
  return (
    <div className="flex flex-col items-center w-full h-33 py-4 gap-5">
      <div className="flex flex-col w-full items-center justify-center">
        <span className="body-rg-500">아직 내 모임이 없어요!</span>
        <span className="body-rg-500">모임을 만들고 운동을 즐겨볼까요?</span>
      </div>

      <Btn_Static
        kind="GY100"
        size="S"
        iconMap={{
          disabled: AddIcon,
          default: AddIcon,
          pressing: AddIcon,
          clicked: AddIcon,
        }}
        label="모임 만들기"
        gap="gap-2"
      />
    </div>
  );
};
