import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DateAndTimePicker from "../../components/common/Date_Time/DateAndPicker";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import Camer_gy_400 from "../../assets/icons/camera_gy_400.svg?react";
import Female from "../../assets/icons/female.svg?react";
import Male from "../../assets/icons/male.svg?react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import { Modal_Caution } from "../../components/MyPage/Modal_Caution";
import TextBox from "../../components/common/Text_Box/TextBox";
import { useForm } from "react-hook-form";
import CicleSRED from "../../assets/icons/cicle_s_red.svg?react";
import { LocationField } from "../../components/common/LocationField";
import { Location } from "../../components/common/contentcard/Location";
import ArrowDown from "@/assets/icons/arrow_down.svg?url";
import { getMyProfile, patchMyProfile } from "../../api/member/my";
import { getMyProfileLocations, postMyProfileLocation, deleteAddress, setMainAddress } from "../../api/member/my";
import type { UserAddress, AddLocationPayload } from "../../api/member/my";

interface MyPageEditProps {
  profileUrl?: File;
  name?: string;
  gender?: "female" | "male";
  birth?: string;
  rank?: string;
  hasNoRank?: boolean;
  locations?: UserAddress[];
  location?: string;
  isMainAddr?: string;
  streetAddr?: string;
  keywords?: string[];
}

export const MyPageEditPage = ({
  profileUrl: initialProfileFileProp,
  name: initialNameProp,
  gender,
  birth: initialBirthProp,
  rank: initialRankProp,
  hasNoRank: initialHasNoRankProp,
  locations: initialLocationsProp = [],
}: MyPageEditProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const selectedPlace = location.state?.selectedPlace;
  // const selectedPlace = location.state?.selectedPlace as UserAddress | undefined;
  const selectedPlace = location.state?.selectedPlace as UserAddress | undefined;;
  const [locations, setLocations] = useState<UserAddress[]>([]);
  const {
    setValue,
  } = useForm();
  const [openModal, setOpenModal] = useState(false); //생년월일 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // "YYYY-MM-DD"
  const [selectedLevel, setSelectedLevel] = useState("NO_RANK");
  const [profileImage, setProfileImage] = useState(""); // imgKey or URL

  //키워드
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const keywordLines = [
    ["브랜드 스폰", "가입비 무료"],
    ["친목", "운영진이 게임을 짜드려요"],
  ];
  const level = ["왕초심","초심","D조","C조","B조","A조","준자강","자강",];
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // const [selectedId, setSelectedId] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImageKey, setProfileImageKey] = useState<string>(""); // 이미지 업로드 키 -> 추후에 연동

  const selectedRank = initialBirthProp ?? "";
  const hasNoRank = initialHasNoRankProp ?? false;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialDataRef = useRef({
    name: initialNameProp ?? "",
    rank: initialRankProp ?? "",
    hasNoRank: initialHasNoRankProp ?? false,
    birth: initialBirthProp ?? "",
    profileImage: undefined as string | undefined,
    locations: initialLocationsProp,
  });
  //내 위치/주소 조회
  useEffect(() => {
    getMyProfileLocations()
      .then(data => setLocations(data))
      .catch(console.error);
  }, []);

  const addLocation = (newLocation: UserAddress) => {
    setLocations(prev => {
      if (prev.length >= 5) {
        alert("위치는 최대 5개까지 추가할 수 있습니다.");
        return prev;
      }
      const exists = prev.some(
        loc =>
          loc.buildingName === newLocation.buildingName &&
          loc.streetAddr === newLocation.streetAddr,
      );
      if (exists) {
        alert("이미 등록된 위치입니다.");
        return prev;
      }
      return [...prev, newLocation];
    });
  };

 useEffect(() => {
    if (selectedPlace) {
      // 중복 체크 후 locations 상태에 추가
      setLocations(prev => {
        const exists = prev.some(
          loc => loc.buildingName === selectedPlace.buildingName && loc.streetAddr === selectedPlace.streetAddr
        );
        if (exists) return prev;

        return [
          ...prev,
          {
            addrId: Date.now(),
            buildingName: selectedPlace.buildingName,
            streetAddr: selectedPlace.streetAddr,
            latitude: 0,
            longitude: 0,
            isMainAddr: false,
            addr1: "",
            addr2: "",
            addr3: "",
          }
        ];
      });

      // URL 상태 초기화 (중복 추가 방지)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [selectedPlace]);
  // useEffect(() => {
  //   if (selectedPlace) {
  //     setLocations(prev => {
  //       const exists = prev.some(
  //         loc => loc.buildingName === selectedPlace.buildingName && loc.streetAddr === selectedPlace.streetAddr
  //       );
  //       if (exists) return prev;

  //       return [
  //         ...prev,
  //         {
  //           addrId: Date.now(),  // 임시 ID
  //           buildingName: selectedPlace.buildingName,
  //           streetAddr: selectedPlace.streetAddr,
  //           addr1: "", addr2: "", addr3: "",
  //           latitude: 0,
  //           longitude: 0,
  //           isMainAddr: false,
  //         },
  //       ];
  //     });

  //     window.history.replaceState({}, document.title);
  //   }
  // }, [selectedPlace]);


  useEffect(() => {
    if (location.state?.selectedPlace) {
      const selectedPlace = location.state.selectedPlace;

      addLocation({
        addrId: Date.now(),           
        buildingName: selectedPlace.name || selectedPlace.buildingName || "", 
        streetAddr: selectedPlace.address || selectedPlace.streetAddr || "",  
        addr1: "",
        addr2: "",
        addr3: "",
        latitude: 0,
        longitude: 0,
        isMainAddr: false,             
      });
    }
  }, [location.state]);

  // //회원 주소 추가
  // const saveLocationToServer = async (location: UserAddress) => {
  //   try {
  //     const savedLocation = await postMyProfileLocation(location);
  //     setLocations(prev => [...prev, savedLocation]);
  //   } catch (err) {
  //     alert("주소 추가에 실패했습니다.");
  //     console.error(err);
  //   }
  // };
 useEffect(() => {
  if (selectedPlace) {
    const saveLocation = async () => {
      try {
        const savedLocation = await postMyProfileLocation(selectedPlace);
        setLocations(prev => [...prev, savedLocation]);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        alert("주소 추가 실패");
      }
    };
    saveLocation();
  }
}, [selectedPlace]);


  //내 프로필 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();

        setName(data.memberName || "");
        setSelectedDate(data.birth || "");
        setSelectedLevel(data.level || "NO_RANK");

        if (data.profileImgUrl) {
          setProfileImage(data.profileImgUrl); 
        }

      } catch (error) {
        console.error("프로필 불러오기 실패", error);
      }
  };

  fetchProfile();
}, []);



  useEffect(() => {
    let initialProfileImageUrl: string | undefined = undefined;

    if (initialProfileFileProp instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        initialProfileImageUrl = reader.result as string;
        setProfileImage(initialProfileImageUrl);
        initialDataRef.current.profileImage = initialProfileImageUrl;
      };
      reader.readAsDataURL(initialProfileFileProp);
    } else {
      // setProfileImage(undefined);
      initialDataRef.current.profileImage = undefined;
    }
  }, [initialProfileFileProp]);

  const isDataChanged = useCallback(() => {
    const initialData = initialDataRef.current;
    // 이름 비교
    if (name !== initialData.name) return true;
    // 급수 비교
    if (hasNoRank !== initialData.hasNoRank) return true; // 급수 없음 상태 변경
    if (!hasNoRank && selectedRank !== initialData.rank) return true; // 급수 선택값 변경 (급수 없음이 아닐 때만)

    if (profileImage !== initialData.profileImage) return true; //이미지
    // 위치 정보 비교
    const currentLocationsIds = locations
      .map(loc => loc.addrId)
      .sort()
      .join(",");
    const initialLocationsIds = initialData.locations
      .map(loc => loc.addrId)
      .sort()
      .join(",");
    if (currentLocationsIds !== initialLocationsIds) return true;

    return false;
  }, [name, selectedRank, hasNoRank, selectedDate, profileImage, locations]);

  // 이름 기능부분
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    // 한영
    input = input.replace(/[^ㄱ-ㅎ가-힣a-zA-Z]/g, "");
    // 17글자까지
    if (input.length > 17) {
      input = input.slice(0, 17);
    }
    setName(input);
  };
  //주소 삭제
  const handleDelete = async (addrId: number) => {
    try {
      await deleteAddress(addrId);
      setLocations(prev => prev.filter(loc => loc.addrId !== addrId));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (selectedId === null) return;

    const updateMainAddress = async () => {
      try {
        await setMainAddress(selectedId);
        // 대표 주소 변경 성공 후에, 필요하면 다시 주소 리스트 불러오기
        const updatedLocations = await getMyProfileLocations();
        setLocations(updatedLocations);
      } catch (error) {
        alert("대표 주소 변경에 실패했습니다.");
        console.error(error);
      }
    };

    updateMainAddress();
  }, [selectedId]);

  const toggleEditMode = () => {
    if (editMode) {
      // 저장 로직
      console.log("변경된 위치 저장됨:", locations);
      // 필요시 서버 저장 API 호출
    }
    setEditMode(prev => !prev);
  };
  
  if (locations.length > 5) {
    alert(
      "위치 정보는 최대 5개까지 저장 가능합니다. 수정 버튼을 통해 등록된 위치를 삭제해주세요",
    );
    return;
  }

  // 프로필 사진 클릭하면 파일 선택창 열기
  const onProfileClick = () => {
    fileInputRef.current?.click();
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setProfileImage(event.target?.result as string); // base64 문자열로 저장
      };
      reader.readAsDataURL(file);
    }
  };
  //생년월일
  const pickerRef = useRef<{ getDueString: () => string }>(null);
  const handleCloseOverlay = () => {
    if (pickerRef.current) {
      const date = pickerRef.current.getDueString(); // 선택된 값
      setSelectedDate(date);
      setValue("birthday", date, { shouldValidate: true });
    }
    setOpenModal(false);
  };

  //수정 완료 버튼 클릭 처리 -> 수정 API 연동
  const onCompleteClick = async () => {
    if (name.trim() === "") {
      alert("이름은 반드시 입력해야 합니다.");
      return;
    }

    if (!isDataChanged()) {
      navigate("/myPage");
      return;
    }

    try {
      const formattedBirth = selectedDate.replace(/\./g, "-");

      const levelMap: Record<string, string> = {
        "왕초심": "NOVICE",
        "초심": "BEGINNER",
        "D조": "D",
        "C조": "C",
        "B조": "B",
        "A조": "A",
        "준자강": "SEMI_EXPERT",
        "자강": "EXPERT",
        "NO_RANK": "NONE",
        "NONE": "NONE"
      };
      const mappedLevel = disabled ? "NONE" : (levelMap[selectedLevel] || "NONE");

      const keywordMap: Record<string, string> = {
        "브랜드 스폰": "BRAND",
        "가입비 무료": "FREE",
        "친목": "FRIENDSHIP",
        "운영진이 게임을 짜드려요": "MANAGER_MATCH",
        "NONE": "NONE",
      };
      const mappedKeywords = selectedKeywords.length > 0 
        ? selectedKeywords.map(k => keywordMap[k] || "NONE")
        : ["NONE"];

      // TODO: 실제 이미지 업로드 후 받아오는 키를 넣어야 함
      const imgKey = profileImageKey || "";

      const payload = {
        memberName: name,
        birth: formattedBirth,
        level: mappedLevel,
        keywords: mappedKeywords,
        imgKey,
      };

      await patchMyProfile(payload);
      alert("프로필이 성공적으로 수정되었습니다.");
      navigate("/myPage");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다.");
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
  const handleCancelLeave = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <PageHeader title="정보 수정하기" onBackClick={onBackClick} />
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <Modal_Caution
              onConfirm={handleConfirmLeave}
              onCancel={handleCancelLeave}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col ">
        {/* 프로필 사진 */}
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
          {/* 숨겨진 파일 인풋 */}
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
              maxLength={17}
              onChange={handleNameChange}
              className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active "
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C0C4CD] body-rg-500">
              ({name?.length ?? 0} / 17)
            </span>
          </div>
        </div>

        {/* 성별 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-1">
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
                onClick={() => setOpenModal(true)}
                value={selectedDate}
              />

              {openModal && (
                <div
                  id="date-picker-overlay"
                  className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
                  onClick={e => {
                    if (
                      (e.target as HTMLElement).id === "date-picker-overlay"
                    ) {
                      handleCloseOverlay();
                    }
                  }}
                >
                  <div onClick={e => e.stopPropagation()}>
                    <DateAndTimePicker ref={pickerRef} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 전국 급수 */}
        <div className="mb-8">
          <label className="flex items-center text-left header-h5 mb-1">
            전국 급수
            <CicleSRED />
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-40">
              <button
                className="border px-3 py-[0.625rem] flex justify-between gap-2 rounded-xl border-gy-200 w-40 h-11 cursor-pointer"
                onClick={() => !disabled && setOpen(!open)}
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
              {open && !disabled && (
                <div className="absolute mt-1 z-10 w-40">
                  <ul
                    className="border rounded-xl border-gy-200 bg-white shadow text-left"
                    style={{ maxHeight: "8.5rem", overflowY: "auto" }}
                  >
                    {level.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setSelectedLevel(item);
                          setOpen(false);
                        }}
                        className="cursor-pointer w-full px-3 py-[0.625rem] hover:bg-gy-100 rounded-xl"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 급수 없음 토글 */}
            <button
              type="button"
              onClick={() => {
                const newDisabled = !disabled;
                setDisabled(newDisabled);
                if (newDisabled) {
                  setOpen(false);
                  setSelectedLevel(""); // 급수 선택 해제
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
        {/* 등록된 위치 */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-1">
            <label className="text-left header-h5">등록된 위치</label>
            <div className="flex items-center">
              <button
                className="rounded-lg bg-[#F4F5F6] body-rg-500 px-4 py-2"
                onClick={toggleEditMode}
              >
                {editMode ? "저장" : "수정"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-start">
            {locations
              .sort((a, b) =>
                a.addrId === selectedId ? -1 : b.addrId === selectedId ? 1 : 0,
              )
              .map((loc, index) => (
                <div className="relative" key={loc.addrId}>
                  <Location
                    className="w-full"
                    isMainAddr={loc.buildingName}
                    streetAddr={loc.streetAddr}
                    initialClicked={loc.addrId === selectedId}
                    disabled={editMode && index === 0}
                    editMode={editMode}
                    onClick={() => {
                      if (!editMode) setSelectedId(loc.addrId);
                    }}
                    onDelete={() => handleDelete(loc.addrId)}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* 키워드 */}
        <div className="mt-8">
          <label className="flex items-center text-left header-h5 mb-1">
            키워드
          </label>
          <div className="flex flex-col gap-3  items-center">
            {keywordLines.map((line, i) => (
              <div key={i} className="flex gap-4 flex-wrap">
                {line.map(keyword => {
                  const isSelected = selectedKeywords.includes(keyword);
                  return (
                    <TextBox
                      key={keyword}
                      isSelected={isSelected}
                      className={`py-2 rounded-xl whitespace-nowrap w-auto max-w-full ${
                        keyword === "친목" ? "px-[1.4rem]" : "px-[2.7rem]"
                      }`}
                      onClick={() => {
                        setSelectedKeywords(prev =>
                          isSelected
                            ? prev.filter(k => k !== keyword)
                            : [...prev, keyword],
                        );
                      }}
                    >
                      {keyword}
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
