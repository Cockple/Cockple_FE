import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { ProgressBar } from "../../../components/common/ProgressBar";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";
import SingleImageUploadBtn from "../../../components/group/groupMaking/SingleImgUploadBtn";
import InputField from "../../../components/common/Search_Filed/InputField";
import { useGroupMakingFilterStore } from "../../../store/useGroupMakingFilter";

import { groupMaking } from "../../../utils/groupMaking";
import { LEVEL_KEY, WEEKLY_KEY } from "../../../constants/options";
import { usePostGroupMaking } from "../../../api/party/groupMaking";

export const GroupSelect = () => {
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
    content,
    setFilter,
  } = useGroupMakingFilterStore();

  const handleInputDetected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target.value;
    const filter = target.slice(0, 45);
    setFilter("content", filter);
  };
  const parsePrice = (value: string) => {
    if (value === "disabled") return 0;
    return Number(value.split(",").join("").slice(0, -1));
  };

  const parseKock = (value: string) => {
    if (value === "disabled") return "";
    return value;
  };

  const apiJoinMoney = parsePrice(joinMoney);
  const apiMoney = parsePrice(money);
  const apiKock = parseKock(kock);
  const apiType = type === "female" ? "여복" : "혼복";

  const apiFemaleLevel = groupMaking(femaleLevel, LEVEL_KEY);
  const apiMaleLevel = groupMaking(maleLevel, LEVEL_KEY);
  const apiWeekly = groupMaking(weekly, WEEKLY_KEY);

  const handleMakingGroupForm = usePostGroupMaking();

  return (
    <>
      <div className="flex flex-col -mb-8 pt-14 min-h-dvh">
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
              InputLength={content?.length}
              onChange={handleInputDetected}
              value={content}
              isTextArea={true}
            />
          </div>
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-6 shrink-0 `}
          onClick={() =>
            handleMakingGroupForm.mutate({
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
              content: content || "",
              imgKey: imgKey,
            })
          }
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
