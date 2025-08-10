import api from "../api";

// API 응답 타입 
export interface ApiMedalItem {
  title: string;
  date: string;
  medalImageSrc: string;
  isAwarded: boolean;
}

export interface ApiMedalResponse {
  code: string;
  message: string;
  data: {
    goldCount: number;
    silverCount: number;
    bronzeCount: number;
    myMedalTotal: number;
    medals: ApiMedalItem[];
  };
  success: boolean;
}

export interface MedalItem {
  id: number;
  title: string;
  date: string;
  medalImageSrc: string;
  isAwarded: boolean;
}

export interface MyMedalData {
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  myMedalTotal: number;
  medals: MedalItem[];
}

export interface MyContestRecord {
  contestId: number;
  contestName: string;
  type: string;
  level: string;
  date: string;
  medalImgUrl: string;
}

export interface PostContestRecordRequest {
  contestName: string;
  date?: string;             
  medalType?: "GOLD" | "SILVER" | "BRONZE" | "NONE";
  type: "SINGLE" | "DOUBLE" | "MIXED" | "TEAM"; 
  level: "EXPERT" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "NONE";
  content?: string;
  contentIsOpen?: boolean;   
  videoIsOpen?: boolean;    
  contestVideos?: string[];
  contestImgs?: string[];     
}

// 내 대회 기록 등록 응답 데이터 타입 
interface PostContestRecordResponse {
  code: string;
  message: string;
  data: {
    contestId: number;
    contestName: string;
    type: string;
    level: string;
    date: string;
    medalImgUrl: string;
  }[];
  success: boolean;
}

export interface ContestRecordDetailResponse {
  contestName: string;
  date: string;  // "2025-08-10" 형식
  medalType: string; // "SILVER" 등
  type: string;  // 참여 형태 (e.g. "DOUBLE")
  level: string; // 급수 (e.g. "INTERMEDIATE")
  content: string; // 대회 기록 텍스트
  contentIsOpen: boolean;
  videoIsOpen: boolean;
  contestVideos: string[];  // 영상 링크 배열
  contestImgs: string[];    // 이미지 경로 배열 (서버 상대경로)
  contestImgsToDelete: string[];
  contestVideoIdsToDelete: number[];
}


//내 메달 조회 
export const getMyMedals = async (): Promise<MyMedalData> => {
  const response = await api.get<ApiMedalResponse>("/api/contests/my/medals");
  console.log("내 메달 조회 API 응답 확인:", response.data);

  const raw = response.data;

  if (!raw.success) {
    throw new Error(raw.message || "메달 정보를 불러오지 못했습니다.");
  }

  const data = raw.data;

  const transformed: MyMedalData = {
    goldCount: data.goldCount,
    silverCount: data.silverCount,
    bronzeCount: data.bronzeCount,
    myMedalTotal: data.myMedalTotal,
    medals: Array.isArray(data.medals)
        ? data.medals.map((item, index) => ({
            id: index,               // 임시 id 
            title: item.title,
            date: item.date,
            medalImageSrc: item.medalImageSrc,
            isAwarded: item.isAwarded,
          }))
        : [],  };

  return transformed;
};

//내 대회 리스트 조회
export const getMyContestList = async (medalType?: "NONE"): Promise<MyContestRecord[]> => {
  const response = await api.get("/api/contests/my", {
    params: medalType ? { medalType } : undefined,
  });
  console.log("내 대회 리스트 조회 API 응답 확인:",response.data);
  const raw = response.data;

  if (!raw.success) {
    throw new Error(raw.message || "내 대회 기록을 불러오지 못했습니다.");
  }

  const records: MyContestRecord[] = raw.data || [];

  return records;
};

//내 대회 기록 등록
export const postMyContestRecord = async (
  body: PostContestRecordRequest
): Promise<PostContestRecordResponse> => {
  const response = await api.post<PostContestRecordResponse>("/api/contests/my", body);
  return response.data;
};

// 내 대회 기록 상세 조회
export const getContestRecordDetail = async (
  contestId: number
): Promise<ContestRecordDetailResponse> => {
  try {
    const response = await api.get(`/api/contests/my/${contestId}`);
    return response.data.data; 
  } catch (error) {
    console.error("대회 기록 상세 조회 오류", error);
    throw error;
  }
};
// 내 대회 기록 삭제
export const deleteContestRecord = async (contestId: number): Promise<void> => {
  try {
    await api.delete(`/api/contests/my/${contestId}`);
  } catch (error) {
    console.error("대회 기록 삭제 오류", error);
    throw error;
  }
};

// 내 대회 기록 수정
export async function patchMyContestRecord(contestId: number, body: PostContestRecordRequest) {
  const response = await fetch(`/api/contests/my/${contestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}
