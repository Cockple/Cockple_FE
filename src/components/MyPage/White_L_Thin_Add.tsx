import Btn_Static from "../common/Btn_Static/Btn_Static";
import Plus from "../../assets/icons/add.svg";

const White_L_Thin_Add = ({
  label = "추가하기",
  onClick,
  disabled = false,
}: {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <Btn_Static
      kind="GY100"
      size="L_Thin"
      label={label}
      iconMap={{
        disabled: Plus,
        default: Plus,
        pressing: Plus,
        clicked: Plus,
      }}
      initialStatus={disabled ? "disabled" : "default"}
      onClick={onClick}
      gap="gap-3"
    />
  );
};

export default White_L_Thin_Add;
