import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
  postMyContestRecord, 
  getContestRecordDetail, 
  patchMyContestRecord,
  type AddContestImgRequest,
  type AddContestVideoRequest,
  type ContestRecordRequest 
} from "../api/contest/contestmy";
import { uploadImages } from "../api/image/imageUpload";
import { 
  TYPE_MAP, 
  LEVEL_MAP, 
  sanitizeUrl, 
  extractKeyFromUrl, 
  FORM_OPTIONS 
} from "../utils/MyPageConstants";

export const useContestRecord = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, setValue } = useForm();
  
  const mode = location.state?.mode ?? null;
  const contestId = location.state?.contestId ?? null;
  const medalData = location.state?.medalData ?? null;
  const isEditMode = mode === "edit";

  const [photos, setPhotos] = useState<string[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);

  const [tournamentName, setTournamentName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
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
          const videoUrls: string[] = [];

          if (Array.isArray(data.contestVideos)) {
             data.contestVideos.forEach((v: any) => {
                const rawUrl = v.videoUrl || v.videoKey || v.url || (typeof v === 'string' ? v : "");
                if (rawUrl) videoUrls.push(rawUrl);
             });
          }
          if (Array.isArray(data.contestVideoUrls)) {
             data.contestVideoUrls.forEach((url: string) => { 
                 if(url && !videoUrls.includes(url)) videoUrls.push(url);
             });
          }

          const photoUrls: string[] = [];
          
          if (Array.isArray(data.contestImgs)) {
             data.contestImgs.forEach((img: any) => {
                const rawUrl = img.imgUrl || img.imgKey || (typeof img === 'string' ? img : "");
                const url = sanitizeUrl(rawUrl);
                if (url) photoUrls.push(url);
             });
          }
          if (Array.isArray(data.contestImgUrls)) {
             data.contestImgUrls.forEach((rawUrl: string) => {
                const url = sanitizeUrl(rawUrl);
                if(url && !photoUrls.includes(url)) photoUrls.push(url);
             });
          }

          setPhotos(photoUrls);
          setVideoLinks(videoUrls);

          dataToSet = {
            title: data.contestName,
            date: data.date,
            type: data.type,
            level: data.level,
            record: data.content,
            medalType: data.medalType,
            contentIsOpen: data.contentIsOpen,
          };
        } catch (error) {
          console.error("기존 대회 기록 불러오기 실패", error);
        }
      } else if (isEditMode && medalData) {
        dataToSet = medalData;
        if (medalData.photo) setPhotos(medalData.photo);
        if (medalData.videoUrl) setVideoLinks(medalData.videoUrl);
      }

      if (dataToSet) {
        setTournamentName(dataToSet.title || "");
        setValue("tournamentName", dataToSet.title || "");
        setSelectedDate(dataToSet.date || "");
        
        if (dataToSet.medalType) {
           const mType = dataToSet.medalType.toUpperCase();
           if (mType === "GOLD") setSelectedIndex(0);
           else if (mType === "SILVER") setSelectedIndex(1);
           else if (mType === "BRONZE") setSelectedIndex(2);
           else setSelectedIndex(null);
        }
        
        const typeMapReverse: any = { "SINGLE": "단식", "MEN_DOUBLES": "남복", "WOMEN_DOUBLES": "여복", "MIX_DOUBLES": "혼복", "MIXED": "혼복" };
        if (dataToSet.type && typeMapReverse[dataToSet.type]) setSelectedForm(typeMapReverse[dataToSet.type]);
        else if (Object.values(typeMapReverse).includes(dataToSet.type)) setSelectedForm(dataToSet.type);

        const levelMapReverse: any = { "NOVICE": "왕초심", "BEGINNER": "초심", "D": "D조", "C": "C조", "B": "B조", "A": "A조", "SEMI_EXPERT": "준자강", "EXPERT": "자강" };
        setSelectedLevel(levelMapReverse[dataToSet.level] ?? dataToSet.level);
        setRecordText(dataToSet.record || "");
        setIsPrivate(!dataToSet.contentIsOpen);
      }
    };
    initializeData();
  }, [isEditMode, contestId, medalData, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    try {
      const { images } = await uploadImages("CONTEST", Array.from(files));
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
      const currentMedalType = (
        selectedIndex === 0 ? "GOLD" : 
        selectedIndex === 1 ? "SILVER" : 
        selectedIndex === 2 ? "BRONZE" : "NONE"
      );
      
      const finalVideos: AddContestVideoRequest[] = videoLinks
        .filter(v => v.trim() !== "")
        .map((url, index) => ({
            videoKey: url, 
            videoOrder: index + 1
        }));

      const finalImgs: AddContestImgRequest[] = photos
        .map((url, index) => ({
            imgKey: extractKeyFromUrl(url),
            imgOrder: index + 1
        }));

      const body: ContestRecordRequest = {
        contestName: tournamentName,
        date: selectedDate ? selectedDate.replace(/\./g, '-') : undefined,
        medalType: currentMedalType,
        type: mappedType,
        level: mappedLevel,
        content: recordText || undefined,
        contentIsOpen: !isPrivate,
        videoIsOpen: true,
        
        contestVideos: finalVideos.length > 0 ? finalVideos : undefined,
        contestImgs: finalImgs.length > 0 ? finalImgs : undefined
      };

      console.log("전송할 Body:", body);

      let response;
      if (isEditMode && contestId) {
        // [수정 PATCH]
        response = await patchMyContestRecord(Number(contestId), body);
      } else {
        // [등록 POST]
        response = await postMyContestRecord(body);
      }

      if (response.success) {
        const resData = response.data as any;
        const newId = isEditMode ? contestId : (resData.contestId || resData.data?.contestId);
        navigate(`/mypage/mymedal/${newId}`, { replace: true });
      } else {
        alert("저장에 실패했습니다: " + response.message);
      }

    } catch (error) {
      console.error("대회 기록 저장 오류", error);
      alert("서버 통신 오류");
    }
  };

  const onBackClick = () => navigate("/mypage/mymedal");

  return {
    state: {
      isEditMode, photos, tournamentName, selectedIndex, videoLinks,
      selectedForm, recordText, isPrivate, selectedDate, selectedLevel,
      isModalOpen, isSaveEnabled,
    },
    actions: {
      setTournamentName, setSelectedIndex, setVideoLinks, setSelectedForm,
      setRecordText, setIsPrivate, setSelectedDate, setSelectedLevel,
      setIsModalOpen, handleFileChange, handleRemovePhoto, handleSaveClick,
      onBackClick, register, setValue, 
    }
  };
};