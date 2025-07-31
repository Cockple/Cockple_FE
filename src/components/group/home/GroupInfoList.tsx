import type React from "react";

interface InfoItem {
  label: string;
  value: string | React.ReactNode;
}

interface GroupInfoListProps {
  items: InfoItem;
}
export const GroupInfoList = ({ items }: GroupInfoListProps) => {
  return (
    <div className="flex gap-1 body-sm-400">
      <span>{items.label}</span>

      <span className="h-4 w-px bg-gray-200 mx-1 "></span>

      <div>{items.value}</div>
    </div>
  );
};
