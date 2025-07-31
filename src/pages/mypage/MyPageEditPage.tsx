import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DateAndTimePicker from "../../components/common/Date_Time/DateAndPicker";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import LocationIcon from "../../assets/icons/mylocation.svg";
import Camer_gy_400 from "../../assets/icons/camera_gy_400.svg?react";
import VectorRed from "../../assets/icons/Vector_red.svg?react";
import Female from "../../assets/icons/female.svg?react";
import Male from "../../assets/icons/male.svg?react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import Search from "../../assets/icons/search.svg?react";
import { Location } from "../../components/common/contentcard/Location";
import { Modal_Caution } from "../../components/MyPage/Modal_Caution";
import TextBox from "../../components/common/Text_Box/TextBox";
import { useForm } from "react-hook-form";

interface LocationType {
  id: number;
  location?: string;
  isMainAddr: string;
  streetAddr: string;
}

interface MyPageEditProps {
  profileUrl?: File;
  name?: string;
  gender?: "female" | "male";
  birth?: string;
  rank?: string;
  hasNoRank?: boolean;
  locations?: LocationType[];
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
  location,
  // isMainAddr="ㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
  // streetAddr="ㅈ돋ㅁㅎㄱ",
  // isMainAddr,
  // streetAddr,
  keywords = ["브랜드 스폰", "친목", "운영진이 게임을 짜드려요", "가입비 무료"],
}: MyPageEditProps) => {
  const navigate = useNavigate();

  const {
    // register,
    // handleSubmit,
    setValue,
    // formState: { errors },
  } = useForm();
  const [openModal, setOpenModal] = useState(false); //생년월일 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(initialNameProp ?? "");
  //키워드
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  // const [selected, setSelected] = useState(false);

  const level = [
    "왕초심",
    "초심",
    "D조",
    "C조",
    "B조",
    "A조",
    "준자강",
    "자강",
  ];
  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [disabled, setDisabled] = useState(false);

  //급수없음 버튼
  // ‼️ 배포 오류를 위한 임시 코드
  const selectedRank = initialBirthProp ?? "";
  const hasNoRank = initialHasNoRankProp ?? false;
  // const [selectedRank, setSelectedRank] = useState(initialRankProp ?? "");
  // const [hasNoRank, setHasNoRank] = useState(initialHasNoRankProp ?? false);

  //Location 임시값////////////////////////////////////////////////////////////////
  const [locations, setLocations] = useState([
    {
      id: 1,
      isMainAddr: "서울특별시 강남구 역삼동",
      streetAddr: "테헤란로 152",
    },
    {
      id: 2,
      isMainAddr: "서울특별시 서초구 서초동",
      streetAddr: "강남대로 373",
    },
    {
      id: 3,
      isMainAddr: "서울특별시 마포구 상암동",
      streetAddr: "월드컵북로 396",
    },
  ]);
  const [selectedId, setSelectedId] = useState(1);
  const [editMode, setEditMode] = useState(false);

  const handleDelete = (id: number) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };

  //Location 임시값////////////////////////////////////////////////////////////////

  //Location
  // const [locations, setLocations] = useState<LocationType[]>([]);
  // const [selectedId, setSelectedId] = useState<number>(1);
  // const [editMode, setEditMode] = useState(false);

  // 사진
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedDate, setSelectedDate] = useState("");
  // const pickerRef = useRef(null);
  // const [isModalNameOpen, setIsModalNameOpen] = useState(false);

  const initialDataRef = useRef({
    name: initialNameProp ?? "",
    rank: initialRankProp ?? "",
    hasNoRank: initialHasNoRankProp ?? false,
    birth: initialBirthProp ?? "",
    profileImage: undefined as string | undefined,
    locations: initialLocationsProp,
  });

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
      setProfileImage(undefined);
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
      .map(loc => loc.id)
      .sort()
      .join(",");
    const initialLocationsIds = initialData.locations
      .map(loc => loc.id)
      .sort()
      .join(",");
    if (currentLocationsIds !== initialLocationsIds) return true;

    return false;
  }, [name, selectedRank, hasNoRank, selectedDate, profileImage, locations]);

  //수정 완료 버튼 클릭 처리
  const onCompleteClick = () => {
    if (name.trim() === "") {
      alert("이름은 반드시 입력해야 합니다.");
      return;
    }

    if (!isDataChanged()) {
      // 변경사항 없을 때 → 바로 마이페이지 이동
      navigate("/myPage");
      return;
    }
    console.log("수정된 정보를 서버에 저장합니다.");

    navigate("/myPage");
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

  // Location 기능 부분
  // const handleDelete = (id: number) => {
  //   setLocations((prev) => prev.filter((loc) => loc.id !== id));
  // };

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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pickerRef = useRef<{ getDueString: () => string }>(null);

  //생년월일
  const handleCloseOverlay = () => {
    if (pickerRef.current) {
      const date = pickerRef.current.getDueString(); // 선택된 값
      setSelectedDate(date);
      setValue("birthday", date, { shouldValidate: true });
    }
    setOpenModal(false);
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

      <div className="flex flex-col">
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
            <VectorRed className="ml-1 w-2 h-2" />
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

        {/* 생년월일 -> 값을 받아오게 해야하는뎁*/}
        <div className="mb-8 flex flex-col items-start">
          <div>
            <div className="text-left flex flex-col gap-2">
              <div className="flex px-1 gap-[2px] items-center">
                <p className="header-h5">생년월일</p>
                <VectorRed className="ml-1 w-2 h-2" />
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
            <VectorRed className="ml-1 w-2 h-2" />
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-40">
              <button
                className="border px-3 py-[0.625rem] flex justify-between gap-2 rounded-xl border-gy-200 w-40 h-11 cursor-pointer"
                onClick={() => !disabled && setOpen(!open)}
              >
                <span className={disabled ? "text-gy-500" : "text-black"}>
                  {selectedLevel || "급수를 선택하세요"}
                </span>
                <img
                  src="/src/assets/icons/arrow_down.svg"
                  alt="Dropdown arrow"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4"
                />
              </button>
              {open && !disabled && (
                <div className="absolute mt-1 z-10 w-40">
                  <ul
                    className="border rounded-xl border-gy-200 bg-white shadow text-left"
                    style={{ maxHeight: '8.5rem', overflowY: 'auto' }} 
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
        <div className="mb-2">
          <label className="flex items-center text-left mb-1 header-h5">
            위치
            <VectorRed className="ml-1 w-2 h-2" />
          </label>
          <div className="relative">
            <input
              type="text"
              value={location}
              placeholder="건물명, 도로명으로 검색"
              className="w-full border rounded-xl	p-2 pr-14 body-md-500  text-[#C0C4CD] border-[#E4E7EA] focus:outline-none"
              onClick={() => navigate("/myPage/edit/location")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-6 h-6" />
            </span>
          </div>
        </div>

        {/* 위치 버튼 */}
        <Btn_Static
          kind="GY100"
          size="L_Thin"
          label="현재 위치 불러오기"
          iconMap={{
            default: LocationIcon,
            pressing: LocationIcon,
            clicked: LocationIcon,
          }}
          iconSize="w-[1.125rem] h-[1.125rem]"
          onClick={() => navigate("/myPage/edit/location/address")}
        />

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
                a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0,
              )
              .map((loc, index) => (
                <div className="relative" key={loc.id}>
                  <Location
                    isMainAddr={loc.isMainAddr}
                    streetAddr={loc.streetAddr}
                    initialClicked={loc.id === selectedId}
                    // disabled={false}
                    disabled={editMode && index === 0}
                    editMode={editMode}
                    onClick={() => {
                      if (!editMode) setSelectedId(loc.id);
                    }}
                    onDelete={() => handleDelete(loc.id)}
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
          <div className="flex flex-wrap gap-2">
            {keywords.map(keyword => {
              const isSelected = selectedKeywords.includes(keyword);
              return (
                <TextBox
                  key={keyword}
                  isSelected={isSelected}
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
        </div>

        <div className="mt-8 mb-8">
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
