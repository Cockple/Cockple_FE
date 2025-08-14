import type { AddLocationPayload } from "../api/member/my";
import type { Place } from "../pages/location/LocationSearchPage";

// 주소 분해
function splitKoreanAddress(addr: string) {
  const tokens = addr.trim().split(/\s+/);
  const [addr1Raw, addr2Raw, addr3Raw] = tokens;

  const addr1 = addr1Raw?.includes("서울") ? "서울특별시" : addr1Raw || "";
  const addr2 = addr2Raw || "";
  const addr3 = addr3Raw || "";
  return { addr1, addr2, addr3 };
}

export function transformPlaceToPayload(place: Place): AddLocationPayload {
  const { addr1, addr2, addr3 } = splitKoreanAddress(place.address_name);

  // ✅ 도로명주소 확보 (필수)
  const streetAddr =
    place.road_address_name && place.road_address_name.length > 0
      ? place.road_address_name
      : "";

  return {
    addr1,
    addr2,
    addr3,
    streetAddr,
    buildingName: place.place_name ?? undefined,
    latitude: Number(place.y),
    longitude: Number(place.x),
    isMainAddr: false,
  };
}
