import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
  postMyContestRecord, 
  getContestRecordDetail, 
  patchMyContestRecord 
} from "../api/contest/contestmy";
import { uploadImages } from "../api/image/imageUpload";
import { 
  TYPE_MAP, 
  LEVEL_MAP, 
  sanitizeUrl, 
  extractKeyFromUrl, 
  FORM_OPTIONS 
} from "../utils/MyPageConstants";
import type { PostContestRecordRequest } from "../api/contest/contestmy";

export const useContestRecord = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, setValue } = useForm();
  
  const mode = location.state?.mode ?? null;
  const contestId = location.state?.contestId ?? null;
  const medalData = location.state?.medalData ?? null;
  const isEditMode = mode === "edit";

  const [photos, setPhotos] = useState<string[]>([]);
  const [tournamentName, setTournamentName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  
  const [initialData, setInitialData] = useState<{ photos: string[], videos: string[] }>({ 
    photos: [], 
    videos: [] 
  });

  const [selectedForm, setSelectedForm] = useState<typeof FORM_OPTIONS[number] | null>(null);
  const [recordText, setRecordText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. 초기 데이터 로드
  useEffect(() => {
    const initializeData = async () => {
      let dataToSet: any = null;

      if (isEditMode && contestId) {
        try {
          const data: any = await getContestRecordDetail(Number(contestId));
          
          let mappedVideoUrls: string[] = [];
          if (data.contestVideoUrls) {
             if (data.contestVideoUrls.length > 0 && typeof data.contestVideoUrls[0] === 'object') {
                mappedVideoUrls = data.contestVideoUrls.map((v: any) => v.videoUrl || v.url);
             } else {
                mappedVideoUrls = data.contestVideoUrls;
             }
          }

          const sanitizedPhotos = data.contestImgUrls.map(sanitizeUrl);

          setInitialData({
            photos: sanitizedPhotos,
            videos: mappedVideoUrls 
          });

          dataToSet = {
            title: data.contestName,
            date: data.date,
            type: data.type,
            level: data.level,
            record: data.content,
            photo: sanitizedPhotos,
            videoUrl: mappedVideoUrls,
            medalType: data.medalType,
            contentIsOpen: data.contentIsOpen,
          };
        } catch (error) {
          console.error("기존 대회 기록 불러오기 실패", error);
        }
      } else if (isEditMode && medalData) {
        dataToSet = medalData;
      }

      if (dataToSet) {
        setTournamentName(dataToSet.title || "");
        setValue("tournamentName", dataToSet.title || "");
        setSelectedDate(dataToSet.date || "");
        
        if (dataToSet.medalType) {
            if (dataToSet.medalType === "GOLD") setSelectedIndex(0);
            else if (dataToSet.medalType === "SILVER") setSelectedIndex(1);
            else if (dataToSet.medalType === "BRONZE") setSelectedIndex(2);
            else setSelectedIndex(null);
        }
        
        const typeMapReverse: any = { "SINGLE": "단식", "MEN_DOUBLES": "남복", "WOMEN_DOUBLES": "여복", "MIX_DOUBLES": "혼복", "MIXED": "혼복" };
        if (dataToSet.type && typeMapReverse[dataToSet.type]) setSelectedForm(typeMapReverse[dataToSet.type]);

        const levelMapReverse: any = { "NOVICE": "왕초심", "BEGINNER": "초심", "D": "D조", "C": "C조", "B": "B조", "A": "A조", "SEMI_EXPERT": "준자강", "EXPERT": "자강", "NONE": "급수 없음", "INTERMEDIATE": "C조", "ADVANCED": "A조" };
        setSelectedLevel(dataToSet.level ? levelMapReverse[dataToSet.level] ?? "" : "");

        setRecordText(dataToSet.record || "");
        setIsPrivate(!dataToSet.contentIsOpen);
        setVideoLinks(dataToSet.videoUrl || []); 
        setPhotos(dataToSet.photo || []);
      }
    };
    initializeData();
  }, [isEditMode, contestId, medalData, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const availableSlots = 3 - photos.length;
    const fileArray = Array.from(files).slice(0, availableSlots);
    if (fileArray.length === 0) return;
    try {
      const { images } = await uploadImages("CONTEST", fileArray);
      setPhotos(prev => [...prev, ...images.map(img => img.imgUrl)].slice(0, 3));
    } catch (err) {
      console.error(err);
      alert("이미지 업로드 실패");
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const isSaveEnabled = tournamentName.trim() !== "" && selectedDate !== "" && selectedForm !== null && selectedLevel !== "";

  // 3. 저장 로직 (PATCH)
  // 3. 저장 로직 (PATCH 사용)
  const handleSaveClick = async () => {
    if (!isSaveEnabled) return;

    try {
      const mappedType = selectedForm ? TYPE_MAP[selectedForm] : "SINGLE";
      const mappedLevel = selectedLevel ? LEVEL_MAP[selectedLevel] : "EXPERT";
      
      const currentMedalType = (
        selectedIndex === 0 ? "GOLD" : 
        selectedIndex === 1 ? "SILVER" : 
        selectedIndex === 2 ? "BRONZE" : "NONE"
      ) as PostContestRecordRequest["medalType"];

      const commonBody = {
        contestName: tournamentName,
        date: selectedDate ? selectedDate.replace(/\./g, '-') : undefined,
        medalType: currentMedalType,
        type: mappedType,
        level: mappedLevel,
        content: recordText || undefined,
        contentIsOpen: !isPrivate,
        videoIsOpen: true,
      };

      let response;

      if (isEditMode && contestId) {
        // [수정 모드: PATCH]

        // 1. 이미지 Diff
        const newImgKeys = photos
            .filter(url => !initialData.photos.includes(url))
            .map(extractKeyFromUrl);
        const deletedImgKeys = initialData.photos
            .filter(url => !photos.includes(url))
            .map(extractKeyFromUrl);

        // 2. 영상 Diff
        const initialVideoKeys = initialData.videos.map(extractKeyFromUrl);
        const currentVideoKeys = videoLinks.filter(v => v.trim() !== "").map(extractKeyFromUrl);

        // 추가된 영상
        const newVideoKeys = currentVideoKeys.filter(v => !initialVideoKeys.includes(v));
        // 삭제된 영상 (Key)
        const deletedVideoKeys = initialVideoKeys.filter(v => !currentVideoKeys.includes(v));

        console.log("삭제할 영상 Key:", deletedVideoKeys);

        // 3. PATCH 요청
        const patchBody: any = { 
            ...commonBody,
            
            // 추가할 영상
            contestVideos: newVideoKeys,
            
            // [핵심 수정] 
            // 1. 숫자 필드(Ids)에는 절대 문자열을 넣으면 안 됨 -> 빈 배열 전송
            contestVideoIdsToDelete: [], 
            
            // 2. 문자열 필드(Videos)에 Key 값을 넣어서 전송 (서버가 이걸 받아주길 기대)
            contestVideosToDelete: deletedVideoKeys, 
            
            // 이미지
            contestImgs: newImgKeys,              
            contestImgsToDelete: deletedImgKeys   
        };

        console.log("최종 전송 Body:", patchBody);

        response = await patchMyContestRecord(Number(contestId), patchBody);

      } else {
        // [생성 모드: POST]
        const photoKeys = photos.map(url => extractKeyFromUrl(url));
        const videoKeys = videoLinks.filter(v => v.trim() !== "").map(url => extractKeyFromUrl(url));
        
        const postBody: PostContestRecordRequest = {
          ...commonBody,
          contestVideos: videoKeys,
          contestImgs: photoKeys, 
        };
        
        response = await postMyContestRecord(postBody);
      }

      if (response.success) {
        const resData = response.data as any;
        const newId = isEditMode ? contestId : (Array.isArray(resData) ? resData[0].contestId : resData.contestId);
        navigate(`/mypage/mymedal/${newId}`, { replace: true });
      } else {
        alert("저장에 실패했습니다: " + response.message);
      }

    } catch (error) {
      console.error("대회 기록 저장 오류", error);
      alert("서버 통신 오류");
    }
  };

  const onBackClick = () => {
    navigate("/mypage/mymedal"); 
  };

  return {
    state: {
      isEditMode,
      photos,
      tournamentName,
      selectedIndex,
      videoLinks,
      selectedForm,
      recordText,
      isPrivate,
      selectedDate,
      selectedLevel,
      isModalOpen,
      isSaveEnabled,
    },
    actions: {
      setTournamentName,
      setSelectedIndex,
      setVideoLinks,
      setSelectedForm,
      setRecordText,
      setIsPrivate,
      setSelectedDate,
      setSelectedLevel,
      setIsModalOpen,
      handleFileChange,
      handleRemovePhoto,
      handleSaveClick,
      onBackClick,
      register, 
      setValue, 
    }
  };
};