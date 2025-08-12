import api from "../api";

export interface MyLocationType {
  memberAddrId: number;
  addr3: string;
  buildingName: string;
  streetAddr: string;
}

export const getMyLocation = async () => {
  try {
    const res = await api.get("/api/my/location");
    return res.data.data;
  } catch (err) {
    console.log("회원 위치 조회 API 실패:", err);
  }
};
