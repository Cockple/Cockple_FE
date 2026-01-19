import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getMyProfile,
  getMyProfileLocations,
  patchMyProfile,
  setMainAddress,
  deleteAddress,
} from "@/api/member/my";
import { uploadImage } from "@/api/image/imageUpload";
import {
  SERVER_TO_LABEL_MAP,
  SERVER_TO_LABEL_KEYWORD_MAP,
  LABEL_TO_SERVER_MAP,
  KEYWORD_MAP_REVERSE,
} from "../components/MyPage/Edit/constants";
import type { UserAddress } from "@/api/member/my";

export const useMyPageEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlace = location.state?.selectedPlace as UserAddress | undefined;

  // 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [profileImageKey, setProfileImageKey] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("급수 없음");
  const [disabled, setDisabled] = useState(false);
  const [locations, setLocations] = useState<UserAddress[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<"FEMALE" | "MALE" | "UNKNOWN">("UNKNOWN");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);


  const initialDataRef = useRef<any>(null);

  //  데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, locs] = await Promise.all([
          getMyProfile(),
          getMyProfileLocations()
        ]);

        setName(profile.memberName ?? "");
        setSelectedDate(profile.birth ?? "");
        setSelectedLevel(SERVER_TO_LABEL_MAP[profile.level || "NONE"] ?? "급수 없음");
        setDisabled(profile.level === "NONE");
        
        if (profile.profileImgUrl) {
           setProfileImage(profile.profileImgUrl);
        }
        if (profile.gender) setSelectedGender(profile.gender);

        const keywords = profile.keywords
          ?.map((k: string) => SERVER_TO_LABEL_KEYWORD_MAP[k])
          .filter(Boolean) || [];
        setSelectedKeywords(keywords);

        setLocations(locs);
        const main = locs.find((l: UserAddress) => l.isMainAddr);
        if (main) setSelectedId(main.addrId);

        initialDataRef.current = {
          name: profile.memberName ?? "",
          birth: profile.birth ?? "",
          level: SERVER_TO_LABEL_MAP[profile.level || "NONE"],
          hasNoRank: profile.level === "NONE",
          gender: profile.gender,
          keywords: keywords.sort().join(","),
          locationIds: locs.map((l: UserAddress) => l.addrId).sort().join(","),
          profileImage: profile.profileImgUrl, 
          mainAddrId: main ? main.addrId : null,
        };

      } catch (e) {
        console.error("데이터 로드 실패", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 위치 추가 로직
  useEffect(() => {
    if (!selectedPlace) return;
    setLocations((prev) => {
      if (prev.length >= 5) {
        alert("위치는 최대 5개까지 추가 가능");
        return prev;
      }
      if (prev.some((l) => l.buildingName === selectedPlace.buildingName)) return prev;
      return [...prev, {
          ...selectedPlace,
          addrId: Date.now(),
          isMainAddr: false
      }];
    });
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [selectedPlace]);


  // 변경 감지 함수 (핵심)
  const isDataChanged = useCallback(() => {
    if (!initialDataRef.current) return false;

    const init = initialDataRef.current;

    if (name !== init.name) return true;
    if (selectedDate !== init.birth) return true;
    if (selectedGender !== init.gender) return true;
    if (disabled !== init.hasNoRank) return true;
    if (!disabled && selectedLevel !== init.level) return true;
    if (profileImage !== init.profileImage) return true;
    if (selectedId !== init.mainAddrId) return true; 

    // 키워드 비교 
    const currentKeywords = [...selectedKeywords].sort().join(",");
    if (currentKeywords !== init.keywords) return true;

    // 위치 목록 비교 (ID 기준)
    const currentLocIds = locations.map(l => l.addrId).sort().join(",");
    if (currentLocIds !== init.locationIds) return true;

    return false;
  }, [
    name,
    selectedDate,
    selectedGender,
    disabled,
    selectedLevel,
    profileImage,
    selectedId,
    selectedKeywords,
    locations
  ]);

  // 핸들러들
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^ㄱ-ㅎ가-힣a-zA-Z]/g, "");
    setName(input.slice(0, 17));
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
    try {
      const { imgUrl, imgKey } = await uploadImage("PROFILE", file);
      setProfileImage(imgUrl);
      setProfileImageKey(imgKey);
    } catch (err) {
      console.error(err);
      alert("이미지 업로드 실패");
    }
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => 
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const handleDelete = async (addrId: number) => {
    try {
      await deleteAddress(addrId);
      setLocations((prev) => prev.filter((loc) => loc.addrId !== addrId));
    } catch (err) {
      console.error(err);
      alert("위치 삭제 실패");
    }
  };

  const onBackClick = () => {
    if (isDataChanged()) {
      setIsModalOpen(true);
    } else {
      navigate("/myPage");
    }
  };

  const handleConfirmLeave = () => {
    setIsModalOpen(false);
    navigate("/myPage");
  };

  const handleCancelLeave = () => setIsModalOpen(false);
  const toggleEditMode = () => setEditMode((prev) => !prev);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("이름은 반드시 입력해야 합니다.");
      return;
    }
    
    // 메인 주소 설정
    if (selectedId !== null && selectedId !== initialDataRef.current?.mainAddrId) {
       try { await setMainAddress(selectedId); } catch(e) { console.error(e); }
    }

    try {
      const formattedBirth = selectedDate.replace(/\./g, "-");
      const mappedLevel = disabled ? "NONE" : LABEL_TO_SERVER_MAP[selectedLevel] || "NONE";
      const mappedKeywords = selectedKeywords.length
        ? selectedKeywords.map((k) => KEYWORD_MAP_REVERSE[k] || "NONE")
        : ["NONE"];

      const payload: any = {
        memberName: name,
        birth: formattedBirth,
        level: mappedLevel,
        keywords: mappedKeywords,
      };
      if (profileImageKey) payload.imgKey = profileImageKey;

      await patchMyProfile(payload);
      alert("프로필이 성공적으로 수정되었습니다.");
      navigate("/myPage");
    } catch (err) {
      console.error(err);
      alert("프로필 수정 실패");
    }
  };

  return {
    state: {
      isLoading,
      name,
      profileImage,
      selectedDate,
      selectedLevel,
      disabled,
      locations,
      selectedKeywords,
      selectedId,
      selectedGender,
      editMode,
    },
    modalState: {
      isModalOpen,
    },
    actions: {
      setName,
      setSelectedDate,
      setSelectedLevel,
      setDisabled,
      setLocations,
      setSelectedKeywords,
      setSelectedId,
      handleNameChange,
      onFileChange,
      toggleKeyword,
      handleDelete,
      toggleEditMode,
      onBackClick,
      handleConfirmLeave,
      handleCancelLeave,
      handleSave,
    },
    isDataChanged,
  };
};