import { useState, useEffect,  } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
  postMyContestRecord, 
  getContestRecordDetail, 
  deleteContestRecord 
} from "../api/contest/contestmy";
import { uploadImages } from "../api/image/imageUpload";
import { 
  TYPE_MAP, 
  LEVEL_MAP, 
  sanitizeUrl, 
  extractKeyFromUrl, 
  FORM_OPTIONS 
} from "../utils/MyPageConstants"
import type { PostContestRecordRequest } from "../api/contest/contestmy";

export const useContestRecord = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, setValue } = useForm();
  
  // 라우터 상태
  const mode = location.state?.mode ?? null;
  const contestId = location.state?.contestId ?? null;
  const medalData = location.state?.medalData ?? null;
  const isEditMode = mode === "edit";

  // UI 상태
  const [photos, setPhotos] = useState<string[]>([]);
  const [tournamentName, setTournamentName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [selectedForm, setSelectedForm] = useState<typeof FORM_OPTIONS[number] | null>(null);
  const [recordText, setRecordText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      let dataToSet: any = null;

      if (isEditMode && contestId) {
        try {
          const data: any = await getContestRecordDetail(Number(contestId));
          
          let mappedVideoUrls: string[] = [];
          if (data.contestVideoUrls && data.contestVideoUrls.length > 0) {
             if (typeof data.contestVideoUrls[0] === 'object') {
                mappedVideoUrls = data.contestVideoUrls.map((v: any) => v.videoUrl || v.url);
             } else {
                mappedVideoUrls = data.contestVideoUrls;
             }
          }

          dataToSet = {
            title: data.contestName,
            date: data.date,
            type: data.type,
            level: data.level,
            record: data.content,
            photo: data.contestImgUrls.map(sanitizeUrl),
            videoUrl: mappedVideoUrls,
            medalType: data.medalType,
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

  const handleSaveClick = async () => {
    if (!isSaveEnabled) return;

    try {
      const mappedType = selectedForm ? TYPE_MAP[selectedForm] : "SINGLE";
      const mappedLevel = selectedLevel ? LEVEL_MAP[selectedLevel] : "EXPERT";
      const photoKeys = photos.map(url => extractKeyFromUrl(url));

      const postBody: PostContestRecordRequest = {
        contestName: tournamentName,
        date: selectedDate ? selectedDate.replace(/\./g, '-') : undefined,
        medalType: selectedIndex === 0 ? "GOLD" : selectedIndex === 1 ? "SILVER" : selectedIndex === 2 ? "BRONZE" : "NONE",
        type: mappedType,
        level: mappedLevel,
        content: recordText || undefined,
        contentIsOpen: true,
        videoIsOpen: true,
        contestVideos: videoLinks.filter(v => v.trim() !== ""),
        contestImgs: photoKeys, 
        contestImgsToDelete: [],
        contestVideoIdsToDelete: [],
      };

      let response;

      if (isEditMode && contestId) {
        // 수정 시: 기존 삭제 후 재생성
        await deleteContestRecord(Number(contestId));
        response = await postMyContestRecord(postBody);
      } else {
        // 생성 시
        response = await postMyContestRecord(postBody);
      }

      if (response.success && response.data) {
        const newContestData = Array.isArray(response.data) ? response.data[0] : response.data;
        navigate(`/mypage/mymedal/${newContestData.contestId}`, { replace: true });
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