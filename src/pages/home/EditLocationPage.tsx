import { useEffect, useState } from "react";
import DynamicBtn from "../../components/common/DynamicBtn/DynamicBtn";
import { LocationField } from "../../components/common/LocationField";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { Location } from "../../components/common/contentcard/Location";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { useNavigate } from "react-router-dom";
import {
  getMyProfileLocations,
  setMainAddress,
  type UserAddress,
} from "../../api/member/my";

export const EditLocationPage = () => {
  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [locationList, setLocationList] = useState<UserAddress[]>([]);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setLocationList(prev => prev.filter(item => item.addrId !== id));
  };

  const handleClick = (clickedId: number) => {
    if (selectedId === clickedId) return;

    setSelectedId(clickedId);
  };

  const onClickEdit = async () => {
    await setMainAddress(Number(selectedId));
    navigate(-1);
  };

  useEffect(() => {
    const getMyLocations = async () => {
      try {
        const data = await getMyProfileLocations();
        console.log(data);
        setLocationList(data);

        const mainAddr = data.find((addr: UserAddress) => addr.isMainAddr);
        if (mainAddr) {
          setSelectedId(mainAddr.addrId);
        }
      } catch (err) {
        console.log("등록된 위치 불러오기 오류: ", err);
      }
    };

    getMyLocations();
  }, []);

  return (
    <div className="flex flex-col pb-27">
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
              key={item.addrId}
              isMainAddr={item.buildingName}
              streetAddr={item.streetAddr}
              editMode={edit}
              disabled={edit && selectedId === item.addrId}
              initialClicked={selectedId === item.addrId}
              onClick={() => handleClick(item.addrId)}
              onDelete={() => handleDelete(item.addrId)}
              className="w-full"
            />
          ))}
        </div>
      </div>

      {!edit && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 px-4">
          <Grad_GR400_L label="수정 완료" onClick={onClickEdit} />
        </div>
      )}
    </div>
  );
};
