import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import DateAndTimePicker from "../../components/common/Date_Time/DateAndPicker";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import { Modal_Caution } from "../../components/MyPage/Modal_Caution";
import TextBox from "../../components/common/Text_Box/TextBox";
import { LocationField } from "../../components/common/LocationField";
import { Location } from "../../components/common/contentcard/Location";

import Camer_gy_400 from "../../assets/icons/camera_gy_400.svg?react";
import Female from "../../assets/icons/female.svg?react";
import Male from "../../assets/icons/male.svg?react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import CicleSRED from "../../assets/icons/cicle_s_red.svg?react";
import ArrowDown from "@/assets/icons/arrow_down.svg?url";

import {
  getMyProfile,
  patchMyProfile,
  getMyProfileLocations,
  deleteAddress,
  setMainAddress,
} from "../../api/member/my";
import type { UserAddress } from "../../api/member/my";

interface MyPageEditProps {
  profileUrl?: File;
  name?: string;
  gender?: "female" | "male";
  birth?: string;
  rank?: string;
  hasNoRank?: boolean;
  locations?: UserAddress[];
}

export const MyPageEditPage = ({
  name: initialNameProp,
  gender,
  birth: initialBirthProp,
  rank: initialRankProp,
  hasNoRank: initialHasNoRankProp,
  locations: initialLocationsProp = [],
}: MyPageEditProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlace = location.state?.selectedPlace as
    | UserAddress
    | undefined;

  const { setValue } = useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<{ getDueString: () => string }>(null);

  // 상태
  const [name, setName] = useState(initialNameProp ?? "");
  const [profileImage, setProfileImage] = useState<string>("");
  const [profileImageKey] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(initialBirthProp ?? "");
  const [selectedLevel, setSelectedLevel] = useState(
    initialRankProp ?? "NO_RANK",
  );
  const [disabled, setDisabled] = useState(initialHasNoRankProp ?? false);
  const [locations, setLocations] =
    useState<UserAddress[]>(initialLocationsProp);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initialDataRef = useRef({
    name: initialNameProp ?? "",
    rank: initialRankProp ?? "",
    hasNoRank: initialHasNoRankProp ?? false,
    birth: initialBirthProp ?? "",
    profileImage: undefined as string | undefined,
    locations: initialLocationsProp,
  });

  const levelOptions = [
    "왕초심",
    "초심",
    "D조",
    "C조",
    "B조",
    "A조",
    "준자강",
    "자강",
  ];
  const keywordLines = [
    ["브랜드 스폰", "가입비 무료"],
    ["친목", "운영진이 게임을 짜드려요"],
  ];

  // ==============================
  // 유틸 함수
  // ==============================
  const isDataChanged = useCallback(() => {
    const initialData = initialDataRef.current;
    if (name !== initialData.name) return true;
    if (disabled !== initialData.hasNoRank) return true;
    if (!disabled && selectedLevel !== initialData.rank) return true;
    if (profileImage !== initialData.profileImage) return true;
    const currentIds = locations
      .map(l => l.addrId)
      .sort()
      .join(",");
    const initialIds = initialData.locations
      .map(l => l.addrId)
      .sort()
      .join(",");
    return currentIds !== initialIds;
  }, [name, selectedLevel, disabled, profileImage, locations]);

  const addLocation = (loc: UserAddress) => {
    setLocations(prev => {
      if (prev.length >= 5) {
        alert("위치는 최대 5개까지 추가 가능");
        return prev;
      }
      if (
        prev.some(
          l =>
            l.buildingName === loc.buildingName &&
            l.streetAddr === loc.streetAddr,
        )
      )
        return prev;
      return [...prev, loc];
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^ㄱ-ㅎ가-힣a-zA-Z]/g, "");
    setName(input.slice(0, 17));
  };

  const handleDelete = async (addrId: number) => {
    try {
      await deleteAddress(addrId);
      setLocations(prev => prev.filter(loc => loc.addrId !== addrId));
    } catch (err) {
      console.error(err);
    }
  };

  const onProfileClick = () => fileInputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCloseOverlay = () => {
    if (pickerRef.current) {
      const date = pickerRef.current.getDueString();
      setSelectedDate(date);
      setValue("birthday", date, { shouldValidate: true });
    }
    setOpenModal(false);
  };

  // ==============================
  // 데이터 로드
  // ==============================
  useEffect(() => {
    getMyProfileLocations().then(setLocations).catch(console.error);
    getMyProfile()
      .then(data => {
        setName(data.memberName ?? "");
        setSelectedDate(data.birth ?? "");
        setSelectedLevel(data.level ?? "NO_RANK");
        if (data.profileImgUrl) setProfileImage(data.profileImgUrl);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedPlace) return;
    addLocation({
      addrId: Date.now(),
      buildingName: selectedPlace.buildingName || "",
      streetAddr: selectedPlace.streetAddr || "",
      latitude: 0,
      longitude: 0,
      isMainAddr: false,
      addr1: "",
      addr2: "",
      addr3: "",
    });
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [selectedPlace]);

  useEffect(() => {
    if (selectedId === null) return;
    const updateMain = async () => {
      try {
        await setMainAddress(selectedId);
        const updated = await getMyProfileLocations();
        setLocations(updated);
      } catch (err) {
        alert("대표 주소 변경 실패");
        console.error(err);
      }
    };
    updateMain();
  }, [selectedId]);

  // ==============================
  // 이벤트 핸들러
  // ==============================
  const serverToLabelMap: Record<string, string> = {
    NOVICE: "왕초심",
    BEGINNER: "초심",
    D: "D조",
    C: "C조",
    B: "B조",
    A: "A조",
    SEMI_EXPERT: "준자강",
    EXPERT: "자강",
    NONE: "급수 없음",
  };
  const labelToServerMap: Record<string, string> = Object.fromEntries(
    Object.entries(serverToLabelMap).map(([k, v]) => [v, k]),
  );

  useEffect(() => {
    getMyProfile().then(data => {
      const levelLabel = serverToLabelMap[data.level || "NONE"] || "급수 없음";
      setSelectedLevel(levelLabel);
    });
  }, []);

  const onBackClick = () =>
    isDataChanged() ? setIsModalOpen(true) : navigate("/myPage");
  const handleConfirmLeave = () => {
    setIsModalOpen(false);
    navigate("/myPage");
  };
  const handleCancelLeave = () => setIsModalOpen(false);

  const toggleEditMode = () => setEditMode(prev => !prev);

  const onCompleteClick = async () => {
    if (!name.trim()) {
      alert("이름은 반드시 입력해야 합니다.");
      return;
    }
    if (!isDataChanged()) {
      navigate("/myPage");
      return;
    }

    try {
      const formattedBirth = selectedDate.replace(/\./g, "-");
      // const levelMap: Record<string, string> = { "왕초심":"NOVICE","초심":"BEGINNER","D조":"D","C조":"C","B조":"B","A조":"A","준자강":"SEMI_EXPERT","자강":"EXPERT","NO_RANK":"NONE","NONE":"NONE" };
      const mappedLevel = disabled
        ? "NONE"
        : labelToServerMap[selectedLevel] || "NONE";
      const keywordMap: Record<string, string> = {
        "브랜드 스폰": "BRAND",
        "가입비 무료": "FREE",
        친목: "FRIENDSHIP",
        "운영진이 게임을 짜드려요": "MANAGER_MATCH",
        NONE: "NONE",
      };
      const mappedKeywords = selectedKeywords.length
        ? selectedKeywords.map(k => keywordMap[k] || "NONE")
        : ["NONE"];
      const payload = {
        memberName: name,
        birth: formattedBirth,
        level: mappedLevel,
        keywords: mappedKeywords,
        imgKey: profileImageKey || "",
      };
      await patchMyProfile(payload);
      alert("프로필이 성공적으로 수정되었습니다.");
      navigate("/myPage");
    } catch (err) {
      console.error(err);
      alert("프로필 수정 실패");
    }
  };

  // ==============================
  // 렌더
  // ==============================
  return (
    <>
      <PageHeader title="정보 수정하기" onBackClick={onBackClick} />
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <Modal_Caution
            onConfirm={handleConfirmLeave}
            onCancel={handleCancelLeave}
          />
        </div>
      )}
      <div className="flex flex-col">
        {/* 프로필 */}
        <div className="flex justify-center mb-8 relative">
          <img
            src={profileImage || "프로필"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
            onClick={onProfileClick}
          />
          <div className="absolute bottom-0 right-[calc(50%-40px)] bg-white shadow-ds100 rounded-full p-1">
            <Camer_gy_400 className="w-4 h-4" />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
          />
        </div>

        {/* 이름 */}
        <div className="mb-8">
          <label className="flex items-center text-left header-h5 mb-1">
            이름
            <CicleSRED />
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active "
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C0C4CD] body-rg-500">
              ({name?.length ?? 0}/17)
            </span>
          </div>
        </div>

        {/* 성별 */}
        <div className="mb-8 flex justify-between items-center">
          <label className="text-left header-h5">성별</label>
          <div className="flex items-center header-h5 gap-2">
            {gender === "female" ? (
              <>
                여성 <Female className="w-4 h-4" />
              </>
            ) : (
              <>
                남성 <Male className="w-4 h-4" />
              </>
            )}
          </div>
        </div>

        {/* 생년월일 */}
        <div className="mb-8 flex flex-col items-start">
          <div className="w-full">
            <div className="text-left flex flex-col gap-2">
              <div className="flex px-1 gap-[2px] items-center">
                <p className="header-h5">생년월일</p>
                <CicleSRED />
              </div>
              <input
                type="text"
                className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active "
                value={selectedDate}
                onClick={() => setOpenModal(true)}
              />
              {openModal && (
                <div
                  id="date-picker-overlay"
                  className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
                  onClick={e =>
                    (e.target as HTMLElement).id === "date-picker-overlay" &&
                    handleCloseOverlay()
                  }
                >
                  <div onClick={e => e.stopPropagation()}>
                    <DateAndTimePicker ref={pickerRef} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 급수 선택 */}
        <div className="mb-8">
          <label className="flex items-center text-left header-h5 mb-1">
            전국 급수
            <CicleSRED />
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-40">
              <button
                className="border px-3 py-[0.625rem] flex justify-between gap-2 rounded-xl border-gy-200 w-40 h-11 cursor-pointer"
                onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
              >
                <span className={disabled ? "text-gy-500" : "text-black"}>
                  {selectedLevel}
                </span>
                <img
                  src={ArrowDown}
                  alt="Dropdown arrow"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4"
                />
              </button>
              {dropdownOpen && !disabled && (
                <ul className="absolute mt-1 z-10 w-40 border rounded-xl border-gy-200 bg-white shadow max-h-36 overflow-y-auto">
                  {levelOptions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setSelectedLevel(item);
                        setDropdownOpen(false);
                      }}
                      className="text-start cursor-pointer w-full px-3 py-[0.625rem] hover:bg-gy-100 rounded-xl"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                const n = !disabled;
                setDisabled(n);
                if (n) {
                  setDropdownOpen(false);
                  setSelectedLevel("");
                }
              }}
              className="flex items-center gap-1"
            >
              {disabled ? (
                <CheckCircledFilled className="w-4 h-4 text-[#FF4D4F]" />
              ) : (
                <CheckCircled className="w-4 h-4 text-gray-400" />
              )}
              급수 없음
            </button>
          </div>
        </div>

        {/* 위치 */}
        <LocationField label="위치" />
        <div className="mt-8">
          <div className="flex justify-between items-center mb-1">
            <label className="text-left header-h5">등록된 위치</label>
            <button
              className="rounded-lg bg-[#F4F5F6] body-rg-500 px-4 py-2"
              onClick={toggleEditMode}
            >
              {editMode ? "저장" : "수정"}
            </button>
          </div>
          <div className="flex flex-col gap-2 text-start">
            {locations
              .sort((a, b) =>
                a.addrId === selectedId ? -1 : b.addrId === selectedId ? 1 : 0,
              )
              .map((loc, index) => (
                <Location
                  key={loc.addrId}
                  className="w-full"
                  isMainAddr={loc.buildingName}
                  streetAddr={loc.streetAddr}
                  initialClicked={loc.addrId === selectedId}
                  disabled={editMode && index === 0}
                  editMode={editMode}
                  onClick={() => !editMode && setSelectedId(loc.addrId)}
                  onDelete={() => handleDelete(loc.addrId)}
                />
              ))}
          </div>
        </div>

        {/* 키워드 */}
        <div className="mt-8">
          <label className="flex items-center text-left header-h5 mb-1">
            키워드
          </label>
          <div className="flex flex-col gap-3 items-center">
            {keywordLines.map((line, i) => (
              <div key={i} className="flex gap-4 flex-wrap">
                {line.map(k => {
                  const isSelected = selectedKeywords.includes(k);
                  return (
                    <TextBox
                      key={k}
                      isSelected={isSelected}
                      className={`py-2 rounded-xl whitespace-nowrap w-auto max-w-full ${k === "친목" ? "px-[1.4rem]" : "px-[2.7rem]"}`}
                      onClick={() =>
                        setSelectedKeywords(prev =>
                          isSelected ? prev.filter(x => x !== k) : [...prev, k],
                        )
                      }
                    >
                      {k}
                    </TextBox>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 mb-8 flex justify-center">
          <Btn_Static
            kind="GR400"
            size="L"
            label="수정 완료"
            shadow="shadow-ds100"
            onClick={onCompleteClick}
          />
        </div>
      </div>
    </>
  );
};
