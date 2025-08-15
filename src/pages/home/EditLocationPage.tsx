import { useEffect, useState } from "react";
import DynamicBtn from "../../components/common/DynamicBtn/DynamicBtn";
import { LocationField } from "../../components/common/LocationField";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { Location } from "../../components/common/contentcard/Location";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { useLocation, useNavigate } from "react-router-dom";
import {
  deleteAddress,
  getMyProfileLocations,
  setMainAddress,
  type UserAddress,
} from "../../api/member/my";
import { CautionModalLocation } from "../../components/home/CautionModalLocation";

export const EditLocationPage = () => {
  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [locationList, setLocationList] = useState<UserAddress[]>([]);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async (id: number) => {
    await deleteAddress(id);
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

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (locationList.length >= 5) {
      setModal(true);
    } else {
      navigate("/location/search", {
        state: {
          returnPath: location.pathname,
          mode: "call-api",
        },
      });
    }
  };

  const handleEditModal = () => {
    setEdit(true);
    setModal(false);
  };

  return (
    <div className="flex flex-col pb-27">
      <PageHeader title="위치 수정하기" onBackClick={() => navigate("/")} />

      <div className="flex flex-col mt-5 gap-8">
        <div className="relative">
          <LocationField label="위치" icon={false} mode="call-api" />
          <div className="absolute inset-0 cursor-pointer" onClick={onClick} />
        </div>

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

      {modal && (
        <CautionModalLocation
          onClick={handleEditModal}
          onclose={() => setModal(false)}
        />
      )}
    </div>
  );
};
