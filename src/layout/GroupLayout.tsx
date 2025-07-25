import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/system/header/PageHeader";
import TabSelector from "../components/common/TabSelector";
import { useEffect, useState } from "react";

const options = [
  { label: "홈", value: "" },
  { label: "채팅", value: "chat" },
  { label: "캘린더", value: "calendar" },
  { label: "멤버", value: "member" },
];

export const GroupLayout = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const location = useLocation();
  const [select, setSelect] = useState("");

  useEffect(() => {
    const currentPath = location.pathname.split(`/group/${groupId}/`)[1] ?? "";
    setSelect(currentPath);
  }, [groupId, location.pathname]);

  const handleChange = (value: string) => {
    setSelect(value);
    navigate(`/group/${groupId}/${value}`);
  };
  return (
    <div className="flex flex-col">
      <PageHeader title="그룹이름" onBackClick={() => navigate("/group")} />
      <TabSelector
        options={options}
        selected={select}
        onChange={handleChange}
      />
      <Outlet />
    </div>
  );
};
