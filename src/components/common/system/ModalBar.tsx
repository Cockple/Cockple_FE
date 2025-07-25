import CloseIcon from "@/assets/icons/dismiss.svg";
import clsx from "clsx";

interface ModalBarProps {
  variant?: "default" | "variant2";
  onClick?: () => void;
}

export const ModalBar = ({ variant = "default", onClick }: ModalBarProps) => {
  return (
    <div
      className={clsx(
        "flex justify-end w-80 box-content",
        variant === "variant2" ? "p-3" : "",
      )}
    >
      <div className="p-1">
        <img
          src={CloseIcon}
          onClick={onClick}
          className="cursor-pointer w-6"
          alt="close icon"
        />
      </div>
    </div>
  );
};
