import { PageHeader } from "@/components/common/system/header/PageHeader";
import TextBox from "@/components/common/Text_Box/TextBox";
import { useRef, useState } from "react";
import DateAndTimePicker, {
  type DateAndTimePickerHandle,
} from "@/components/common/Date_Time/DateAndPicker";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@/components/common/ProgressBar";
import Btn_Static from "@/components/common/Btn_Static/Btn_Static";
import InputField from "@/components/common/Search_Filed/InputField";
import { useOnboardingState } from "@/store/useOnboardingStore";
import Circle_RedIcon from "@/assets/icons/cicle_s_red.svg?url";
import { handleInput } from "@/utils/handleDetected";

export const OnboardingInfoPage = () => {
  const navigate = useNavigate();

  //store
  const { memberName, gender, birth, setTemp } = useOnboardingState();
  //정보
  const [localName, setLocalName] = useState(memberName ?? "");
  const [selected, isSelected] = useState<"male" | "female" | null>(gender);
  const [selectedDate, setSelectedDate] = useState(birth ?? "");
  const [openModal, setOpenModal] = useState(false);

  //초기화

  const pickerRef = useRef<DateAndTimePickerHandle>(null);

  const handleCloseOverlay = () => {
    if (pickerRef.current) {
      const date = pickerRef.current.getDueString(); // 선택된 값
      setSelectedDate(date); //  input에 넣기
    }
    setOpenModal(false); // 닫기
  };

  const isFormValid =
    localName.length > 0 && selected !== null && selectedDate.length > 0;

  const handleInputDetected = handleInput(17, v => {
    setLocalName(v);
  });
  const handleNext = () => {
    setTemp({
      memberName: localName,
      gender: selected,
      birth: selectedDate,
    });
    navigate("/onboarding/level");
  };

  return (
    <>
      <div className="flex flex-col -mb-8 pt-14 min-h-dvh">
        <PageHeader title="회원 정보 입력" />
        <ProgressBar width={!isFormValid ? "4" : "24"} />

        <section className="text-left flex flex-col  gap-3 w-full flex-1">
          <p className="header-h4 pt-15 pb-5">기본 정보를 입력해주세요</p>
          {/* 첫번째 */}
          <InputField
            labelName="이름"
            value={localName}
            InputLength={localName.length}
            onChange={handleInputDetected}
          />

          {/* 두번째 */}
          <div className="text-left flex flex-col gap-2 pb-5">
            <div className="flex px-1 gap-[2px] items-center">
              <p className="header-h5">성별</p>
              <img src={Circle_RedIcon} alt="icon-cicle" />
            </div>
            <div className="flex gap-[13px]">
              <TextBox
                children="남성"
                isSelected={selected === "male"}
                onClick={() => isSelected(selected === "male" ? null : "male")}
                className="w-19"
              />
              <TextBox
                children="여성"
                isSelected={selected === "female"}
                onClick={() =>
                  isSelected(selected === "female" ? null : "female")
                }
                className="w-19"
              />
            </div>
          </div>
          {/* 세번째 */}

          <InputField
            labelName="생년월일"
            onClick={() => setOpenModal(true)}
            readOnly
            value={selectedDate}
          />

          {openModal && (
            <div
              id="date-picker-overlay"
              className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
              onClick={e => {
                const target = e.target as HTMLElement;
                if (target.id === "date-picker-overlay") {
                  handleCloseOverlay();
                }
              }}
            >
              <div
                onClick={e => e.stopPropagation()} // 내부 클릭 시 닫히지 않도록 방지
              >
                <DateAndTimePicker ref={pickerRef} />
              </div>
            </div>
          )}
        </section>

        {/* 버튼 */}
        <div
          className="flex items-center justify-center mb-6 shrink-0 "
          onClick={handleNext}
        >
          <Btn_Static
            label="다음"
            kind="GR400"
            size="L"
            initialStatus={!isFormValid ? "disabled" : "default"}
          />
        </div>
      </div>
    </>
  );
};
