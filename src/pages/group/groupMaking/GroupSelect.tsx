import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../../components/common/ProgressBar";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";
import SingleImageUploadBtn from "../../../components/group/groupMaking/SingleImgUploadBtn";
import InputField from "../../../components/common/Search_Filed/InputField";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../../api/api";
import { useGroupMakingFilterStore } from "../../../store/useGroupMakingFilter";
import type {
  GroupMakingRequestDto,
  GroupMakingResponseDTO,
} from "../../../types/groupMaking";
import { groupMaking } from "../../../utils/groupMaking";
import { LEVEL_KEY, WEEKLY_KEY } from "../../../constants/options";
import { handleInput } from "../../../utils/handleDetected";

export const GroupSelect = () => {
  const [text, setText] = useState<string>();
  const {
    region,
    femaleLevel,
    maleLevel,
    name,
    weekly,
    type,
    kock,
    money,
    ageRange,
    joinMoney,
    time,
    imgKey,
  } = useGroupMakingFilterStore();
  const navigate = useNavigate();

  const handleInputDetected = handleInput(45, v => {
    setText(v);
  });
  const parsePrice = (value: string) => {
    if (value === "disabled") return 0;
    return Number(value.split(",").join("").slice(0, -1));
  };

  const parseKock = (value: string) => {
    if (value === "disabled") return "";
    return value;
  };

  const axios = api;
  const apiJoinMoney = parsePrice(joinMoney);
  const apiMoney = parsePrice(money);
  const apiKock = parseKock(kock);
  const apiType = type === "female" ? "여복" : "혼복";

  const apiFemaleLevel = groupMaking(femaleLevel, LEVEL_KEY);
  const apiMaleLevel = groupMaking(maleLevel, LEVEL_KEY);
  const apiWeekly = groupMaking(weekly, WEEKLY_KEY);

  const submitGroupMaking = async (): Promise<GroupMakingResponseDTO> => {
    const RequestBody: GroupMakingRequestDto = {
      partyName: name,
      partyType: apiType,
      femaleLevel: apiFemaleLevel,
      maleLevel: apiMaleLevel,
      addr1: region[0],
      addr2: region[1],
      activityTime: time,
      activityDay: apiWeekly,
      designatedCock: apiKock,
      joinPrice: apiJoinMoney,
      price: apiMoney,
      minBirthYear: ageRange[0],
      maxBirthYear: ageRange[1],
      content: text || "",
      imgKey: imgKey,
    };
    const { data } = await axios.post<GroupMakingResponseDTO>(
      "/api/parties",
      RequestBody,
    );
    return data;
  };

  const handleMakingGroup = useMutation({
    mutationFn: submitGroupMaking,
    onSuccess: res => {
      console.log("성공");
      console.log(res.data);
      navigate(`/confirm/${res.data.partyId}`, {
        state: {
          onboarding: false,
        },
      });
    },

    onError: error => {
      console.log(error);
    },
  });
  return (
    <>
      <div className="flex flex-col -mb-8" style={{ minHeight: "91dvh" }}>
        <PageHeader title="모임 만들기" />
        <ProgressBar width={"96"} />

        <section className="text-left flex flex-col  gap-4 w-full mb-6 flex-1">
          <p className="header-h4 pt-8 pb-5">모임 선택 정보를 입력해주세요.</p>
          {/* 첫번째 */}
          <div className="flex flex-col gap-8">
            <SingleImageUploadBtn />

            <InputField
              isRequired={false}
              labelName="멤버에게 하고 싶은 말 / 소개"
              InputMaxLength={45}
              InputLength={text?.length}
              onChange={handleInputDetected}
              value={text}
              isTextArea={true}
            />
          </div>
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-4 shrink-0 `}
          onClick={() => handleMakingGroup.mutate()}
        >
          <Btn_Static
            label="다음"
            kind="GR400"
            size="L"
            initialStatus={"default"}
          />
        </div>
      </div>
    </>
  );
};
