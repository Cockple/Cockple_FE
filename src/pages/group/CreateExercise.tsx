import { useEffect, useRef, useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { TimeInputField } from "../../components/group/main/create_exercise/TimeInputField";
import DateAndTimePicker, {
  type DateAndTimePickerHandle,
} from "../../components/common/Date_Time/DateAndPicker";
import RedCircle from "@/assets/icons/cicle_s_red.svg?react";
import { DropBox } from "../../components/common/DropBox";
import { TitleBtn } from "../../components/group/main/create_exercise/TitleBtn";
import { TextField } from "../../components/group/main/create_exercise/TextField";
import GR400_L from "../../components/common/Btn_Static/Text/GR400_L";
import { LocationField } from "../../components/common/LocationField";
import { useLocation, useParams } from "react-router-dom";
import { Location } from "../../components/common/contentcard/Location";
import WeeklyCalendar from "../../components/common/Date_Time/WeeklyCalendar";

type SelectedPlace = {
  name: string;
  address: string;
  x: string;
  y: string;
};

export const CreateExercise = () => {
  const [selectedDate, setSelectedDate] = useState<string | number | null>(
    null,
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [timeType, setTimeType] = useState<"start" | "end" | null>(null);
  const [headCount, setHeadCount] = useState("");
  const [allowGuestInvite, setAllowGuestInvite] = useState(true);
  const [allowExternalGuest, setAllowExternalGuest] = useState(true);
  const [notice, setNotice] = useState("");
  const [locationDetail, setLocationDetail] = useState<SelectedPlace | null>(
    null,
  );

  const location = useLocation();
  const selectedPlace = location.state?.selectedPlace;
  const { groupId } = useParams();

  useEffect(() => {
    if (selectedPlace) {
      setLocationDetail(selectedPlace);
    }
  }, [selectedPlace]);

  const pickerRef = useRef<DateAndTimePickerHandle>(null);

  const handleClickInput = (type: "start" | "end") => {
    setTimeType(type);
    setOpenModal(true);
  };

  const handleConfirmTime = () => {
    const selectedTime = pickerRef.current?.getDueString() ?? "";
    if (timeType === "start") setStartTime(selectedTime);
    else if (timeType === "end") setEndTime(selectedTime);
    setOpenModal(false);
  };

  const headCountOptions = Array.from({ length: 44 }, (_, i) => ({
    value: String(i + 1),
  }));

  const isFormValid = () => {
    return (
      startTime.trim() !== "" &&
      endTime.trim() !== "" &&
      headCount.trim() !== "" &&
      notice.replace(/\s/g, "").length > 0
    );
  };

  const onDeleteLocation = () => {
    setLocationDetail(null);
  };

  const handleDateSelect = (date: string | number) => {
    setSelectedDate(date);
    console.log("선택된 날짜: ", date);
  };

  return (
    <div className="flex flex-col gap-2">
      <PageHeader title="운동 만들기" />
      <div className="flex flex-col gap-8">
        <div className="w-full h-17">
          <WeeklyCalendar shadow={false} onClick={handleDateSelect} />
        </div>
        <div className="flex flex-col gap-4">
          <LocationField label="위치" icon={true} />

          {locationDetail && (
            <Location
              isMainAddr={locationDetail.name}
              streetAddr={locationDetail.address}
              editMode={true}
              onDelete={onDeleteLocation}
              className="w-full"
            />
          )}
        </div>

        <TimeInputField
          label="시간"
          startTime={startTime}
          endTime={endTime}
          onClickStart={() => handleClickInput("start")}
          onClickEnd={() => handleClickInput("end")}
        />
        <div className="flex flex-col gap-2">
          <div className="text-left flex gap-0.5 items-center">
            <span className="header-h5 ml-1">모집 인원</span>
            <RedCircle />
          </div>
          <DropBox
            options={headCountOptions}
            value={headCount}
            onChange={setHeadCount}
            placeholder="인원 선택"
          />
        </div>

        <div className="flex flex-col gap-5">
          <TitleBtn
            label="모임 멤버 게스트 초대 허용"
            checked={allowGuestInvite}
            onChange={setAllowGuestInvite}
          />
          <TitleBtn
            label="외부 게스트 참여 허용"
            checked={allowExternalGuest}
            onChange={setAllowExternalGuest}
          />
        </div>

        <TextField maxLength={45} value={notice} onChange={setNotice} />
      </div>

      <div className="mt-32 flex justify-center">
        <GR400_L
          label="운동 만들기"
          initialStatus={!isFormValid() ? "disabled" : "default"}
        />
      </div>

      {openModal && (
        <div
          id="date-picker-overlay"
          className="fixed bottom-0 bg-black/20 -mx-4 w-full max-w-[444px] h-full flex items-center z-50"
          onClick={e => {
            const target = e.target as HTMLElement;
            if (target.id === "date-picker-overlay") {
              handleConfirmTime();
            }
          }}
        >
          <DateAndTimePicker ref={pickerRef} showTime />
        </div>
      )}
    </div>
  );
};
