import api from "../api";

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

export interface PostContestRecordRequest {
  contestName: string;
  date?: string;             
  medalType?: "GOLD" | "SILVER" | "BRONZE" | "NONE";
  type: "SINGLE" | "MEN_DOUBLES" | "WOMEN_DOUBLES" | "MIX_DOUBLES"; 
  level: "EXPERT" | "BEGINNER" | "NOVICE" | "SEMI_EXPERT" | "A" | "B" | "C" | "D" | "NONE";
  content?: string;
  contentIsOpen?: boolean;   
  videoIsOpen?: boolean;    
  contestVideos?: string[];        
  contestImgs?: string[];          
  
  contestImgsToDelete?: string[];     // 삭제할 이미지 
  contestVideoIdsToDelete?: number[]; // 삭제할 영상 ID
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
  }; 
  success: boolean;
}


export interface ContestRecordDetailResponse {
  contestName: string;
  date: string;  
  medalType: string; 
  type: string;  
  level: string; 
  content: string; 
  contentIsOpen: boolean;
  videoIsOpen: boolean;
  contestVideoUrls: any[];  
  contestImgUrls: string[];    
  contestImgsToDelete?: string[];
  contestVideoIdsToDelete?: number[];
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
          id: index,
          title: item.title,
          date: item.date,
          medalImgUrl: item.medalImgUrl, 
          isAwarded: item.isAwarded,
        }))
      : [],
  };
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
      contestName: detail.contestName ?? "",
      date: detail.date ?? "",
      medalType: detail.medalType ?? "NONE",
      type: detail.type ?? "SINGLE",
      level: detail.level ?? "NONE",
      content: detail.content ?? "",
      contentIsOpen: detail.contentIsOpen ?? false,
      videoIsOpen: detail.videoIsOpen ?? false,
      contestVideoUrls: Array.isArray(detail.contestVideoUrls)
        ? detail.contestVideoUrls
        : [],
      contestImgUrls: Array.isArray(detail.contestImgUrls)
        ? detail.contestImgUrls
        : [],
      contestImgsToDelete: Array.isArray(detail.contestImgsToDelete)
        ? detail.contestImgsToDelete
        : [],
      contestVideoIdsToDelete: Array.isArray(detail.contestVideoIdsToDelete)
        ? detail.contestVideoIdsToDelete
        : [],
    };
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

// 대회 기록 수정 요청 타입 정의 
export interface PatchContestRecordRequest {
  contestName: string;
  date?: string;
  medalType?: "GOLD" | "SILVER" | "BRONZE" | "NONE";
  type: "SINGLE" | "MEN_DOUBLES" | "WOMEN_DOUBLES" | "MIX_DOUBLES";
  level: "EXPERT" | "BEGINNER" | "NOVICE" | "SEMI_EXPERT" | "A" | "B" | "C" | "D" | "NONE";
  content?: string;
  contentIsOpen?: boolean;
  videoIsOpen?: boolean;
  contestVideos?: string[];
  contestImgs?: string[];
}

// 대회 기록 수정 응답 타입 정의 
export interface PatchContestRecordResponse {
  code: string;
  message: string;
  data: {
    imgUrl: string;
    imgKey: string;
    originalFileName: string;
    fileSize: number;
    fileType: string;
  };
  success: boolean;
}

// 내 대회 기록 수정
export const patchMyContestRecord = async (
  contestId: number,
  body: PatchContestRecordRequest
): Promise<PatchContestRecordResponse> => {
  try {
    const response = await api.patch<PatchContestRecordResponse>(
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