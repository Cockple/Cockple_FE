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
      <span className="shrink-0">{items.label}</span>

      <span className="h-2.5 w-px bg-gray-200 mx-1 break-all mt-0.5"></span>

      <div className="text-left max-w-full min-w-0">{items.value}</div>
    </div>
  );
};
