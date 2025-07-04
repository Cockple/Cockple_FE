import React from "react";
import DeleteIcon from "../../../../assets/icons/delete.svg";
import RefreshIcon from "../../../../assets/icons/refresh.svg";
import ChatQuestionIcon from "../../../../assets/icons/chat_question.svg";
import Btn_Static from "../Btn_Static";

type GradMixType = "delete" | "refresh" | "chat_question";

interface GradMixLProps {
  type: GradMixType;
}

const Grad_Mix_L = ({ type }: GradMixLProps) => {
  const getLeftButtonStyle = () => {
    switch (type) {
      case "delete":
        return "border border-error text-error";
      default:
        return "border border-default text-black";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "delete":
        return DeleteIcon;
      case "refresh":
        return RefreshIcon;
      case "chat_question":
        return ChatQuestionIcon;
    }
  };

  return (
    <div
      className="w-[23.4375rem] h-[6rem] pt-[0.5rem] pr-[1rem] pb-[2.25rem] pl-[1rem] gap-[0.5625rem] flex"
      style={{
        background:
          "linear-gradient(180deg, rgba(252, 252, 255, 0) 0%, rgba(252, 252, 255, 0.8) 50%, #FCFCFF 90%)",
      }}
    >
      {/* 왼쪽 버튼 */}
      <button
        className={`w-[5rem] h-[3.25rem] px-[1rem] py-[0.75rem] rounded-[1rem] bg-white border-[1px] ${getLeftButtonStyle()} cursor-pointer`}
        style={{ boxShadow: "0 0 0.25rem 0 rgba(18, 18, 18, 0.12)" }}
      >
        <img src={getIcon()} alt={`${type} icon`} className="w-6 h-6 mx-auto" />
      </button>

      {/* 오른쪽 버튼 */}
      <Btn_Static kind="GR400" size="M" label="Btn" />
    </div>
  );
};

export default Grad_Mix_L;
