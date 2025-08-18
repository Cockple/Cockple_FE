import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import GR400_L from "../../components/common/Btn_Static/Text/GR400_L";
import Search from "@/assets/icons/search.svg?react";
import type { Place } from "./LocationSearchPage";
import { ProgressBar } from "../../components/common/ProgressBar";
import Marker from "@/assets/icons/map_marker.svg?url";
import { transformPlaceToPayload } from "../../utils/address";
import { postMyProfileLocation } from "../../api/member/my";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export const LocationMapPage = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const place = searchParams.get("place");
  const address = searchParams.get("address");
  const road = searchParams.get("road");
  const query = searchParams.get("query");

  const location = useLocation();
  const returnPath = location.state?.returnPath ?? "/";
  const mode = location.state?.mode ?? "fill-only";

  const user = false;

  const handleSelect = async (place: Place) => {
    const payload = transformPlaceToPayload(place);

    if (mode === "call-api") {
      await postMyProfileLocation(payload);
      navigate(returnPath);
    } else {
      navigate(returnPath, {
        state: { payload },
      });
      console.log(returnPath);
    }
  };

  useEffect(() => {
    const kakao = window.kakao;
    if (!mapRef.current || !kakao || !x || !y) return;

    kakao.maps.load(() => {
      const lat = parseFloat(y);
      const lng = parseFloat(x);
      const centerPos = new kakao.maps.LatLng(lat, lng);

      const mapOption = {
        center: centerPos,
        level: 2,
        draggable: true,
        srcollwheel: true,
      };

      const map = new kakao.maps.Map(mapRef.current, mapOption);

      new kakao.maps.Marker({
        position: centerPos,
        map,
        image: new kakao.maps.MarkerImage(Marker, new kakao.maps.Size(40, 40), {
          offset: new kakao.maps.Point(20, 20),
        }),
      });
    });
  }, [x, y]);

  return (
    <div className="flex flex-col h-dvh -mx-4 overflow-y-hidden relativ -mb-8 pt-14">
      <PageHeader
        title="주소 검색"
        className="px-4"
        onBackClick={() => navigate(`/location/search?query=${query}`)}
      />

      {user && <ProgressBar width="72" className="mx-4" />}

      <div ref={mapRef} className="w-full flex-1 relative">
        <div
          className="absolute flex items-center gap-2 top-3 left-1/2 -translate-x-1/2 w-86 h-11 px-3 py-2.5 border-1 border-gy-200 border-soft bg-white z-10 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <span className="flex-1 text-left header-h5">{place}</span>
          <Search />
        </div>
      </div>

      <div className="absolute bottom-0 w-full max-w-[444px] pt-5 pb-6 flex flex-col items-center gap-5 bg-white z-20 rounded-t-2xl">
        <div className="flex flex-col px-2 w-86.75 items-start gap-1">
          <span className="body-md-500">{place}</span>
          <span className="body-rg-500">{address}</span>
        </div>
        <GR400_L
          label="이 위치로 위치 등록"
          onClick={() =>
            handleSelect({
              place_name: place ?? "",
              address_name: address ?? "",
              road_address_name: road ?? "",
              x: x ?? "",
              y: y ?? "",
            })
          }
        />
      </div>
    </div>
  );
};
