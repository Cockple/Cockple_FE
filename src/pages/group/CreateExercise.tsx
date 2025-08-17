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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Location } from "../../components/common/contentcard/Location";
import WeeklyCalendar from "../../components/common/Date_Time/WeeklyCalendar";
import { transformPlaceToPayload } from "../../utils/address";
import useCreateExerciseStore from "../../store/createExerciseStore";
import { createExerciseApi } from "../../api/exercise/createExerciseApi";
import {
  formatKoreanTimeToHHMMSS,
  formatToKoreanTimeWithAmPm,
} from "../../utils/formatKoreanTimeToHHMMSS";
import { useExerciseEditDetail } from "../../api/exercise/useExerciseEditDetail";
import { updateExerciseApi } from "../../api/exercise/updateExerciseApi";
export const CreateExercise = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    headCount,
    setHeadCount,
    allowGuestInvite,
    setAllowGuestInvite,
    allowExternalGuest,
    setAllowExternalGuest,
    notice,
    setNotice,
    locationDetail,
    setLocationDetail,
    resetForm,
  } = useCreateExerciseStore();

  const [openModal, setOpenModal] = useState(false);
  const [timeType, setTimeType] = useState<"start" | "end" | null>(null);
  const { groupId, exerciseId } = useParams();
  const { data: editData } = useExerciseEditDetail(exerciseId!);

  useEffect(() => {
    if (editData) {
      setSelectedDate(editData.date);
      setLocationDetail({
        buildingName: editData.buildingName,
        addr1: editData.roadAddress,
        addr2: "",
        addr3: "",
        streetAddr: editData.roadAddress,
        latitude: editData.latitude,
        longitude: editData.longitude,
      });
      setStartTime(formatToKoreanTimeWithAmPm(editData.startTime));
      setEndTime(formatToKoreanTimeWithAmPm(editData.endTime));
      setHeadCount(String(editData.maxCapacity));
      setAllowGuestInvite(editData.allowMemberGuestsInvitation);
      setAllowExternalGuest(editData.allowExternalGuests);
      setNotice(editData.notice);
    }
  }, [editData]);

  useEffect(() => {
    const selectedPlace = location.state?.selectedPlace;
    if (selectedPlace) {
      const payload = transformPlaceToPayload(selectedPlace);
      setLocationDetail(payload);

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, setLocationDetail, navigate, location.pathname]);

  const pickerRef = useRef<DateAndTimePickerHandle>(null);

  const handleClickInput = (type: "start" | "end") => {
    setTimeType(type);
    setOpenModal(true);
  };

  const handleConfirmTime = () => {
    const selectedTime = pickerRef.current?.getDueString() ?? "";

    if (timeType === "start") {
      setStartTime(selectedTime);
    } else if (timeType === "end") {
      setEndTime(selectedTime);
    }

    setOpenModal(false);
  };

  const headCountOptions = Array.from({ length: 44 }, (_, i) => ({
    value: String(i + 1),
  }));

  const isFormValid = () => {
    return (
      !!selectedDate &&
      !!locationDetail &&
      startTime.trim() !== "" &&
      endTime.trim() !== "" &&
      headCount.trim() !== ""
    );
  };

  const onDeleteLocation = () => {
    setLocationDetail(null);
  };

  const onCreateExercise = async () => {
    if (selectedDate && locationDetail && headCount) {
      const formattedStartTime = formatKoreanTimeToHHMMSS(startTime);
      const formattedEndTime = formatKoreanTimeToHHMMSS(endTime);
      const payload = {
        date: String(selectedDate),
        buildingName: locationDetail.buildingName || "",
        roadAddress:
          locationDetail.streetAddr ||
          locationDetail.addr1 +
            " " +
            locationDetail.addr2 +
            " " +
            locationDetail.addr3,
        latitude: locationDetail.latitude,
        longitude: locationDetail.longitude,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        maxCapacity: Number(headCount),
        allowMemberGuestsInvitation: allowGuestInvite,
        allowExternalGuests: allowExternalGuest,
        notice: notice,
      };

      console.log(payload);

      try {
        if (exerciseId) {
          await updateExerciseApi(exerciseId, payload);
          navigate(`/group/Mygroup/MyExerciseDetail/${exerciseId}`);
        } else {
          if (!groupId) {
            console.error("그룹정보가 올바르지 않습니다.");
            return;
          }
          const data = await createExerciseApi(groupId, payload);
          console.log(data);
          navigate(`/group/${groupId}`);
          resetForm();
        }
      } catch (err) {
        console.error("운동 생성 실패: ", err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        title={exerciseId ? "운동 수정하기" : "운동 만들기"}
        onBackClick={
          exerciseId
            ? () => navigate(`/group/Mygroup/MyExerciseDetail/${exerciseId}`)
            : () => navigate(-1)
        }
      />
      <div className="flex flex-col gap-8">
        <div className="w-full h-17">
          <WeeklyCalendar
            shadow={false}
            selectedDate={selectedDate ?? undefined}
            onClick={setSelectedDate}
          />
        </div>
        <div className="flex flex-col gap-4">
          <LocationField
            label="위치"
            icon={true}
            mode="fill-only"
            returnPath={location.pathname}
          />

          {locationDetail && (
            <Location
              isMainAddr={locationDetail.buildingName || ""}
              streetAddr={
                locationDetail.addr1 +
                " " +
                locationDetail.addr2 +
                " " +
                locationDetail.addr3
              }
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
          label={exerciseId ? "운동 수정하기" : "운동 만들기"}
          initialStatus={isFormValid() ? "default" : "disabled"}
          onClick={onCreateExercise}
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
