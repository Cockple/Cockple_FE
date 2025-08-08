// 더 이상 이 페이지는 사용하지 않습니다.
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Search from "@/assets/icons/search.svg?react";
import LocationIcon from "@/assets/icons/mylocation.svg?react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import MapMarker from "@/assets/icons/map_marker.svg?react";

interface LocationItem {
  id: number;
  isMainAddr: string;
  streetAddr: string;
}

interface MyPageAddressSearchPageProps {
  initialMainAddr?: string;
  initialStreetAddr?: string;
  initialInputAddress?: string;
  onRegisterLocation?: (location: LocationItem) => void;
}

export const MyPageAddressSearchPage = ({
  initialMainAddr = "현재 위치를 불러오는 중...",
  initialStreetAddr = "지도에서 위치를 선택해주세요.",
  initialInputAddress = "",
  onRegisterLocation,
}: MyPageAddressSearchPageProps) => {
  const navigate = useNavigate();

  const [currentMainAddr, setCurrentMainAddr] = useState(initialMainAddr);
  const [currentStreetAddr, setCurrentStreetAddr] = useState(initialStreetAddr);
  const [inputAddress, setInputAddress] = useState(initialInputAddress);
  const [markerPosition, setMarkerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const initialMapStateRef = useRef<{
    marker: { x: number; y: number } | null;
    mainAddr: string;
    streetAddr: string;
    inputAddr: string;
  } | null>(null);

  const mockReverseGeocode = useCallback((x: number, y: number) => {
    return new Promise<{ main: string; street: string }>(resolve => {
      setTimeout(() => {
        const randomId = Math.floor(Math.random() * 1000);
        resolve({
          main: `가상 건물명 ${randomId}`,
          street: `가상 도로명 주소 ${x.toFixed(0)}번길 ${y.toFixed(0)}`,
        });
      }, 300);
    });
  }, []);

  const mockGeocode = useCallback((address: string) => {
    return new Promise<{ x: number; y: number }>(resolve => {
      setTimeout(() => {
        if (mapRef.current) {
          const mapWidth = mapRef.current.offsetWidth;
          const mapHeight = mapRef.current.offsetHeight;
          const seed = address.length % 10;
          const xOffset = (seed - 5) * 5;
          const yOffset = (seed - 5) * 5;
          resolve({ x: mapWidth / 2 + xOffset, y: mapHeight / 2 + yOffset });
        } else {
          resolve({ x: 150, y: 150 });
        }
      }, 300);
    });
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log(`현재 위치: Lat ${lat}, Lng ${lng}`);

          if (mapRef.current) {
            const mapWidth = mapRef.current.offsetWidth;
            const mapHeight = mapRef.current.offsetHeight;
            const markerX = mapWidth / 2;
            const markerY = mapHeight / 2;
            setMarkerPosition({ x: markerX, y: markerY });

            const { main, street } = await mockReverseGeocode(markerX, markerY);
            setCurrentMainAddr(main);
            setCurrentStreetAddr(street);
            setInputAddress(main);

            initialMapStateRef.current = {
              marker: { x: markerX, y: markerY },
              mainAddr: main,
              streetAddr: street,
              inputAddr: main,
            };
          }
        },
        error => {
          console.error("현재 위치를 가져오는데 실패했습니다:", error);
          alert("현재 위치를 가져올 수 없습니다. 지도에서 직접 선택해주세요.");
          setCurrentMainAddr("위치를 찾을 수 없음");
          setCurrentStreetAddr("지도에서 직접 선택해주세요.");
          initialMapStateRef.current = {
            marker: null,
            mainAddr: initialMainAddr,
            streetAddr: initialStreetAddr,
            inputAddr: initialInputAddress,
          };
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      alert("이 브라우저는 지오로케이션을 지원하지 않습니다.");
      initialMapStateRef.current = {
        marker: null,
        mainAddr: initialMainAddr,
        streetAddr: initialStreetAddr,
        inputAddr: initialInputAddress,
      };
    }
  }, [
    initialMainAddr,
    initialStreetAddr,
    initialInputAddress,
    mockReverseGeocode,
  ]);

  useEffect(() => {
    const initializeLocation = async () => {
      if (initialMainAddr && initialMainAddr !== "현재 위치를 불러오는 중...") {
        const { x, y } = await mockGeocode(initialMainAddr);
        setMarkerPosition({ x, y });
        setCurrentMainAddr(initialMainAddr);
        setCurrentStreetAddr(initialStreetAddr);
        setInputAddress(initialInputAddress);
        initialMapStateRef.current = {
          marker: { x, y },
          mainAddr: initialMainAddr,
          streetAddr: initialStreetAddr,
          inputAddr: initialInputAddress,
        };
      } else {
        getCurrentLocation();
      }
    };
    initializeLocation();
  }, [
    initialMainAddr,
    initialStreetAddr,
    initialInputAddress,
    mockGeocode,
    getCurrentLocation,
  ]);

  const handleMapClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMarkerPosition({ x, y });

    const { main, street } = await mockReverseGeocode(x, y);
    setCurrentMainAddr(main);
    setCurrentStreetAddr(street);
    setInputAddress(main);
  };

  const handleResetToInitialLocation = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    console.log("현위치 버튼 클릭됨");
    console.log("초기 상태:", initialMapStateRef.current);
    if (initialMapStateRef.current && initialMapStateRef.current.marker) {
      setMarkerPosition(initialMapStateRef.current.marker);
      setCurrentMainAddr(initialMapStateRef.current.mainAddr);
      setCurrentStreetAddr(initialMapStateRef.current.streetAddr);
      setInputAddress(initialMapStateRef.current.inputAddr);
      console.log("초기 위치로 복귀 완료");
    } else {
      console.log(
        "initialMapStateRef에 유효한 초기 마커 위치 없음. 현재 위치 재탐색 시도.",
      );
      getCurrentLocation();
    }
  };

  const handleRegisterCurrentLocation = () => {
    if (
      currentMainAddr === "위치를 찾을 수 없음" ||
      currentMainAddr === "현재 위치를 불러오는 중..."
    ) {
      alert("유효한 위치를 먼저 선택해주세요.");
      return;
    }
    onRegisterLocation?.({
      id: Date.now(),
      isMainAddr: currentMainAddr,
      streetAddr: currentStreetAddr,
    });
    navigate("/mypage/edit");
  };

  const handleBackClick = () => {
    navigate("/mypage/edit");
  };

  const handleSearchInputKeyPress = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      navigate(
        `/mypage/edit/location?initialLocationValue=${encodeURIComponent(inputAddress)}`,
      );
    }
  };

  const handleSearchButtonClick = () => {
    navigate(
      `/mypage/edit/location?initialLocationValue=${encodeURIComponent(inputAddress)}`,
    );
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[23.4375rem] mx-auto relative">
      <PageHeader title="주소 검색" onBackClick={handleBackClick} />

      <div className="flex items-center bg-white rounded-xl shadow-ds200 px-4 py-2 mx-4 mt-4 focus:outline-none">
        <input
          type="text"
          value={inputAddress}
          onChange={e => setInputAddress(e.target.value)}
          onKeyPress={handleSearchInputKeyPress}
          className="flex-grow header-h5 focus:outline-none"
          placeholder="건물명, 도로명으로 검색"
        />
        <button onClick={handleSearchButtonClick}>
          <Search className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={mapRef}
        className="relative w-full h-[26.625rem] mt-4 overflow-hidden"
        onClick={handleMapClick}
      >
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm z-0">
          지도 로딩 중... (클릭해서 마커 이동)
        </div>
        <MapMarker
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{
            left: markerPosition ? markerPosition.x : "50%",
            top: markerPosition ? markerPosition.y : "50%",
          }}
        />

        <div className="absolute right-4 bottom-2">
          <button
            onClick={handleResetToInitialLocation}
            className="w-11 h-11 bg-white shadow-ds200 rounded-full p-1 flex items-center justify-center"
          >
            <LocationIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-white w-full pt-5 pb-4 rounded-t-2xl shadow-md mt-auto text-left px-4">
        <p className="body-md-500">{currentMainAddr}</p>
        <p className="body-rg-500 mt-1">{currentStreetAddr}</p>

        <div className="mt-5">
          <Btn_Static
            kind="GR600"
            size="L"
            label="이 위치로 위치 등록"
            bgColor="bg-[#0B9A4E]"
            textColor="text-white"
            justify="justify-center"
            onClick={handleRegisterCurrentLocation}
          />
        </div>
      </div>
    </div>
  );
};
