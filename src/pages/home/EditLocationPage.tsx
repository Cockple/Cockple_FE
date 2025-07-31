import { useState } from "react";
import DynamicBtn from "../../components/common/DynamicBtn/DynamicBtn";
import { LocationField } from "../../components/common/LocationField";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { Location } from "../../components/common/contentcard/Location";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { useNavigate } from "react-router-dom";

const testData = [
  {
    id: 1,
    name: "디에이치스티어아이파크",
    address: "서울특별시 강남구 개포로 310",
  },
  {
    id: 2,
    name: "디에이치스티어아이파크",
    address: "서울특별시 강남구 개포로 310",
  },
  {
    id: 3,
    name: "디에이치스티어아이파크",
    address: "서울특별시 강남구 개포로 310",
  },
  {
    id: 4,
    name: "디에이치스티어아이파크",
    address: "서울특별시 강남구 개포로 310",
  },
];

export const EditLocationPage = () => {
  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [locationList, setLocationList] = useState(testData);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setLocationList(prev => prev.filter(item => item.id !== id));
  };

  const handleClick = (clickedId: number) => {
    if (selectedId === clickedId) return;

    setSelectedId(clickedId);
  };

  return (
    <div className="flex flex-col">
      <PageHeader title="위치 수정하기" />

      <div className="flex flex-col mt-5 gap-8">
        <LocationField label="위치" icon={false} />

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="header-h5 text-black">등록된 위치</span>
            <DynamicBtn size="default" onClick={() => setEdit(!edit)}>
              {edit ? "저장" : "수정"}
            </DynamicBtn>
          </div>

          {locationList.map(item => (
            <Location
              key={item.id}
              isMainAddr={item.name}
              streetAddr={item.address}
              editMode={edit}
              disabled={edit && selectedId === item.id}
              initialClicked={selectedId === item.id}
              onClick={() => handleClick(item.id)}
              onDelete={() => handleDelete(item.id)}
              className="w-full"
            />
          ))}
        </div>
      </div>

      {!edit && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 px-4">
          <Grad_GR400_L label="수정 완료" onClick={() => navigate(-1)} />
        </div>
      )}
    </div>
  );
};
