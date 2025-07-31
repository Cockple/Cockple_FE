import Dismiss from "../../assets/icons/dismiss.svg?react";
import SubtractPerson from "../../assets/icons/subtract_person.svg?react";
import RD500_S from "../common/Btn_Static/Text/RD500_S";

interface ModalSubtractBaseProps {
  title: string;
  messages: string[];
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal_Subtract = ({
  title,
  messages,
  confirmLabel,
  onConfirm,
  onCancel,
}: ModalSubtractBaseProps) => {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onCancel}
    >
      <div
        className="bg-white w-[21.4375rem]  h-[15.75rem] flex flex-col p-3 shadow-ds300 rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-end mb-2">
          <Dismiss className="w-8 h-8 cursor-pointer" onClick={onCancel} />
        </div>

        <div className="flex flex-col items-center text-center gap-1 mb-4 leading-snug">
          <SubtractPerson className="w-8 h-8" />
          <p className="header-h4">{title}</p>
          {messages.map((msg, idx) => (
            <p key={idx} className="body-rg-500">{msg}</p>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          <RD500_S label={confirmLabel} onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
};
