import api from "../api";

// ==========================================
// 1. 공통 응답 타입 (메달, 리스트)
// ==========================================

export interface ApiMedalItem {
  title: string;
  date: string;
  isAwarded: boolean;
  medalImgUrl: string | null; 
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
  medalImgUrl: string | null; 
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

// ==========================================
// 2. 공통 DTO (등록/수정 시 영상/이미지 추가용)
// [명세서 기준: 객체 배열 {key, order}]
// ==========================================

export interface AddContestImgRequest {
  imgKey: string;
  imgOrder: number;
}

export interface AddContestVideoRequest {
  videoKey: string;
  videoOrder: number;
}

// ==========================================
// 3. 상세 조회 (GET)
// ==========================================

// 조회 응답 - 영상 객체 (ID 포함 - 백엔드 수정 시 사용)
export interface ContestVideoResponse {
  id: number;        
  videoKey?: string;
  videoUrl?: string; // 서버가 url 또는 key로 줄 수 있음
  videoOrder?: number;
}

// 조회 응답 - 이미지 객체 (ID 포함 - 백엔드 수정 시 사용)
export interface ContestImgResponse {
  id: number;        
  imgKey?: string;
  imgUrl?: string;
  imgOrder?: number;
}

export interface ContestRecordDetailResponse {
  contestId: number;
  contestName: string; 
  title?: string;      
  date: string;
  medalType: string;
  type: string;
  level: string;
  content: string;
  
  // [현재 명세서] 단순 문자열 배열 (ID 없음 -> 삭제 불가 원인)
  contestImgUrls: string[];   
  contestVideoUrls: string[]; 
  
  // [미래 대비] 백엔드가 수정해주면 채워질 ID 포함 객체 배열
  contestVideos?: ContestVideoResponse[];
  contestImgs?: ContestImgResponse[];
  
  contentIsOpen?: boolean;
  videoIsOpen?: boolean;
}

// 내 대회 기록 상세 조회
export const getContestRecordDetail = async (
  contestId: number
): Promise<ContestRecordDetailResponse> => {
  try {
    const response = await api.get<{
      code: string;
      message: string;
      data: ContestRecordDetailResponse;
      success: boolean;
    }>(`/api/contests/my/${contestId}`);

    const detail = response.data.data;

    if (!detail) {
      throw new Error("대회 기록 상세 정보가 없습니다.");
    }

    return {
      contestId: detail.contestId,
      contestName: detail.contestName || detail.title || "",
      date: detail.date || "",
      medalType: detail.medalType || "NONE",
      type: detail.type || "SINGLE",
      level: detail.level || "NONE",
      content: detail.content || "",
      
      // 현재 명세서 (문자열)
      contestImgUrls: Array.isArray(detail.contestImgUrls) ? detail.contestImgUrls : [],
      contestVideoUrls: Array.isArray(detail.contestVideoUrls) ? detail.contestVideoUrls : [],
      
      // 백엔드 수정 대비 (객체)
      contestVideos: Array.isArray(detail.contestVideos) ? detail.contestVideos : [],
      contestImgs: Array.isArray(detail.contestImgs) ? detail.contestImgs : [],

      contentIsOpen: detail.contentIsOpen ?? true,
      videoIsOpen: detail.videoIsOpen ?? true,
    };
  } catch (error) {
    console.error("대회 기록 상세 조회 오류", error);
    throw error;
  }
};

// ==========================================
// 4. 등록 (POST) 요청 타입
// [명세서 반영: 객체 배열 사용]
// ==========================================

export interface PostContestRecordRequest {
  contestName: string;
  date?: string;             
  medalType?: string; 
  type: string;       
  level: string;      
  content?: string;
  contentIsOpen?: boolean;   
  videoIsOpen?: boolean;    
  
  // [POST] 객체 배열 ({key, order})
  contestVideos?: AddContestVideoRequest[]; 
  contestImgs?: AddContestImgRequest[];          
}

interface PostContestRecordResponse {
  code: string;
  message: string;
  data: {
    contestId: number;
  }; 
  success: boolean;
}

// 내 대회 기록 등록 (POST)
export const postMyContestRecord = async (
  body: PostContestRecordRequest
): Promise<PostContestRecordResponse> => {
  const response = await api.post<PostContestRecordResponse>("/api/contests/my", body);
  return response.data;
};

// ==========================================
// 5. 수정 (PATCH) 요청 타입
// [명세서 반영: 추가는 객체 배열, 삭제는 ID 배열]
// ==========================================

export interface PatchContestRecordRequest {
  contestName: string;
  date?: string;
  medalType?: string;
  type: string;
  level: string;
  content?: string;
  contentIsOpen?: boolean;
  videoIsOpen?: boolean;

  // [PATCH] 추가 (객체 배열)
  contestVideos?: AddContestVideoRequest[]; 
  contestImgs?: AddContestImgRequest[];          
  
  // [PATCH] 삭제 (ID 숫자 배열 - 명세서: long[])
  contestImgsToDelete?: number[];     
  contestVideoIdsToDelete?: number[]; 
}

// 내 대회 기록 수정 (PATCH)
export const patchMyContestRecord = async (
  contestId: number,
  body: PatchContestRecordRequest
): Promise<PostContestRecordResponse> => {
  try {
    const response = await api.patch<PostContestRecordResponse>(
      `/api/contests/my/${contestId}`,
      body
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "대회 기록 수정 실패");
    }

    return response.data;
  } catch (error: any) {
    console.error("대회 기록 PATCH 오류", error.response?.data || error.message);
    throw error;
  }
};

// ==========================================
// 6. 기타 (메달 조회, 리스트 조회, 삭제)
// ==========================================

// 내 메달 조회 
export const getMyMedals = async (): Promise<MyMedalData> => {
  const response = await api.get<ApiMedalResponse>("/api/contests/my/medals");
  const raw = response.data;

  if (!raw.success) {
    throw new Error(raw.message || "메달 정보를 불러오지 못했습니다.");
  }

  const data = raw.data;
  return {
    goldCount: data.goldCount,
    silverCount: data.silverCount,
    bronzeCount: data.bronzeCount,
    myMedalTotal: data.myMedalTotal,
    medals: Array.isArray(data.medals)
      ? data.medals.map((item, index) => ({
          id: index,
          title: item.title,
          date: item.date,
          medalImgUrl: item.medalImgUrl, 
          isAwarded: item.isAwarded,
        }))
      : [],
  };
};

// 내 대회 리스트 조회
export const getMyContestList = async (medalType?: "NONE"): Promise<MyContestRecord[]> => {
  const response = await api.get("/api/contests/my", {
    params: medalType ? { medalType } : undefined,
  });
  const raw = response.data;

  if (!raw.success) {
    throw new Error(raw.message || "내 대회 기록을 불러오지 못했습니다.");
  }

  return raw.data || [];
};

// 내 대회 기록 삭제 (게시글 자체 삭제)
export const deleteContestRecord = async (contestId: number): Promise<void> => {
  try {
    await api.delete(`/api/contests/my/${contestId}`);
  } catch (error) {
    console.error("대회 기록 삭제 오류", error);
    throw error;
  }
};