import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api";
// 메인 >> 건물명
// 서브 >> 도로명

// 사용자 마이페이지
export interface MyPageProps {
  name?: string;
  gender?: "FEMALE" | "MALE";
  level?: string;
  birth?: string;
  profileImage?: File;

  myGroupCount?: number;
  myExerciseCount?: number;

  myMedalTotal?: number;
  goldCount?: number;
  silverCount?: number;
  bronzeCount?: number;
  disabled?: boolean;
}

///////주소 관련 interface//////
export interface UserAddress {
  // id: number;
  addrId: number;
  addr1: string;
  addr2: string;
  addr3: string;
  streetAddr: string;
  buildingName: string;
  latitude: number;
  longitude: number;
  isMainAddr: boolean;
}

//회원 주소 추가 시 필요한 interface
export interface AddLocationPayload {
  addr1: string;
  addr2: string;
  addr3: string;
  streetAddr: string;
  buildingName: string;
  latitude: number;
  longitude: number;
  isMainAddr?: boolean;
}
////////////////////////////////

//////내 프로필 수정 및 조회///////
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  errorReason?: {
    code: string;
    message: string;
    httpStatus: string;
  };
  success: boolean;
}

interface ProfileUpdatePayload {
  memberName: string;
  birth: string;
  level: string;
  keywords: string[];
  imgKey: string;
}
/////////////////////////////////

//내 프로필 조회
export async function getMyProfile() {
  const response = await api.get("/api/my/profile");
  return response.data.data;
}

export const useMyProfile = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: getMyProfile,
  });

// 프로필 수정
export const patchMyProfile = async (payload: ProfileUpdatePayload) => {
  const response = await api.patch("/api/my/profile", payload);
  return response.data;
};

//회원 주소 전체 조회
export const getMyProfileLocations = async () => {
  const res = await api.get("/api/my/profile/locations");
  return res.data.data;
};

//회원 주소 추가
export const postMyProfileLocation = async (payload: AddLocationPayload) => {
  const res = await api.post("/api/my/profile/locations", payload);
  return res.data.data;
};

//회원 주소 삭제
export const deleteAddress = async (memberAddrId: number) => {
  try {
    const res = await api.delete(`/api/my/profile/locations/${memberAddrId}`);
    if (res.data.success) {
      console.log("주소 삭제 성공", res.data.message);
      // 삭제 성공 시 상태 갱신이나 UI 업데이트 수행
    } else {
      console.error("주소 삭제 실패", res.data.message);
    }
  } catch (err) {
    console.error("주소 삭제 에러", err);
  }
};

//회원 대표 주소 변경
export const setMainAddress = async (memberAddrId: number) => {
  try {
    const res = await api.patch(
      `/api/my/profile/locations/${memberAddrId}`,
      {},
    );
    if (res.data.success) {
      console.log("대표 주소 변경 성공", res.data.message);
    } else {
      console.error("대표 주소 변경 실패", res.data.message);
    }
  } catch (err) {
    console.error("대표 주소 변경 에러", err);
  }
};

//회원탈퇴
export const deleteAccount = async () => {
  const { data } = await api.patch("/api/member");
  return data;
};

export const useDeleteAccount = (onSuccess?: () => void) => {
  // const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => onSuccess?.(),
    onError: err => console.log(err),
  });
};
