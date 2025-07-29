import CheckBoxBtn from "../../../components/common/DynamicBtn/CheckBoxBtn";
import InputField from "../../../components/common/Search_Filed/InputField";

interface CheckBoxInputFiledProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  value: string;
  checked?: boolean;
  checkLabel: string;
  InputLength?: number | null;
  labelName: string;
  InputMaxLength?: number | null;
  onCheckChange?: (checked: boolean) => void;
}
export default function CheckBoxInputFiled({
  onChange,
  value,
  onBlur,
  onFocus,
  checkLabel,
  InputLength,
  labelName,
  InputMaxLength,
  onCheckChange,
}: CheckBoxInputFiledProps) {
  return (
    <div className="relative">
      <InputField
        labelName={labelName}
        onChange={onChange}
        value={value === "disabled" ? "" : value}
        onBlur={onBlur}
        onFocus={onFocus}
        InputLength={value === "disabled" ? null : InputLength}
        InputMaxLength={InputMaxLength}
        disabled={value === "disabled"}
      />
      <div className="absolute top-0 right-0">
        <CheckBoxBtn
          children={checkLabel}
          onClick={() => {
            const willBeChecked = value !== "disabled";
            onCheckChange?.(willBeChecked);
          }}
          checked={value === "disabled"}
        />
      </div>
    </div>
  );
}
