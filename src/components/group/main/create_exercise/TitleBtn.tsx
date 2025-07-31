import { SlideSwitch } from "../../../common/SlideSwitch";

interface TitleBtnProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export const TitleBtn = ({ label, checked, onChange }: TitleBtnProps) => {
  return (
    <div className="w-full px-1 flex justify-between">
      <span>{label}</span>
      <SlideSwitch checked={checked} onChange={onChange} />
    </div>
  );
};
