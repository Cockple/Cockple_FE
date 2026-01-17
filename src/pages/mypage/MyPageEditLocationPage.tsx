import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import Search from "../../assets/icons/search.svg?react";
import LocationIcon from "../../assets/icons/mylocation.svg";
import { LocationList } from "../../components/common/contentcard/LocationList";

interface LocationItem {
  id: number;
  isMainAddr: string;
  streetAddr: string;
}

interface MyPageEditLocationPageProps {
  initialLocationValue?: string;
}

export const MyPageEditLocationPage = ({
  initialLocationValue = "",
}: MyPageEditLocationPageProps) => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState(initialLocationValue);
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  );

  const handleSearch = () => {
    console.log(`Searching for: ${searchText}`);
    setSearchResults([]);
    setSelectedLocationId(null);
  };

  const handleLocationClick = (id: number, isClicked: boolean) => {
    if (isClicked) {
      setSelectedLocationId(id);
      console.log("선택된 위치 ID:", id);
    } else {
      setSelectedLocationId(null);
      console.log("선택 해제된 위치 ID:", id);
    }
  };

  const handleLoadCurrentLocation = () => {
    navigate("/mypage/edit/location/address");
  };

  const handleBackClick = () => {
    navigate("/mypage/edit");
  };

  const handleRegisterLocation = () => {
    if (selectedLocationId === null) {
      alert("등록할 위치를 선택해주세요.");
      return;
    }
    const selectedLocation = searchResults.find(
      loc => loc.id === selectedLocationId,
    );
    if (selectedLocation) {
      console.log("등록할 위치:", selectedLocation);
      navigate("/mypage/edit");
    }
  };

  return (
    <>
      <PageHeader title="주소 검색" onBackClick={handleBackClick} />
      <div className="min-h-screen flex flex-col pb-8 mt-6">
        <div className="mb-2">
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="건물명, 도로명으로 검색"
              className="w-full border rounded-xl p-2 pr-14 body-md-500 text-[#C0C4CD] border-[#E4E7EA] focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>

        <Btn_Static
          kind="GY100"
          size="L_Thin"
          label="현재 위치 불러오기"
          iconMap={{
            default: LocationIcon,
            pressing: LocationIcon,
            clicked: LocationIcon,
          }}
          iconSize="w-[1.125rem] h-[1.125rem]"
          onClick={handleLoadCurrentLocation}
        />

        <div className="mt-6 flex-grow overflow-auto flex flex-col gap-4">
          {searchResults.length > 0 ? (
            searchResults.map((locationItem, index) => (
              <React.Fragment key={locationItem.id}>
                <LocationList
                  id={locationItem.id}
                  isMainAddr={locationItem.isMainAddr}
                  streetAddr={locationItem.streetAddr}
                  initialClicked={selectedLocationId === locationItem.id}
                  onClick={handleLocationClick}
                />
                {index < searchResults.length - 1 && (
                  <div className="border border-[#E4E7EA] mx-1 mt-2" />
                )}
              </React.Fragment>
            ))
          ) : (
            <p className=" body-rg-500 text-[#E4E7EA] text-center">
              검색 결과가 없습니다.
            </p>
          )}
        </div>

        <div className="mt-6">
          <Btn_Static
            kind="GR600"
            size="L"
            label="이 위치로 위치 등록"
            bgColor="bg-[#0B9A4E]"
            textColor="text-white"
            justify="justify-center"
            onClick={handleRegisterLocation}
          />
        </div>
      </div>
    </>
  );
};
