import { PageHeader } from "../../components/common/system/header/PageHeader";
import TextBox from "../../components/common/Text_Box/TextBox";
import { useEffect, useState } from "react";
import Female from "../../assets/icons/female.svg?react";
import Male from "../../assets/icons/male.svg?react";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import InputField from "../../components/common/Search_Filed/InputField";
import DropCheckBox from "../../components/common/Drop_Box/DropCheckBox";
import { useForm } from "react-hook-form";
import { Member } from "../../components/common/contentcard/Member";
import Circle_Red from "@/assets/icons/cicle_s_red.svg?url";

type MemberStatus =
  | "waiting"
  | "invite"
  | "request"
  | "approved"
  | "Participating";

interface MemberProps {
  name: string;
  gender: "male" | "female";
  level: string;
  birth?: string;
  status: MemberStatus;
}

export const InviteGuest = () => {
  //정보
  const [localName, setLocalName] = useState(name ?? "");
  const [selected, isSelected] = useState<"male" | "female" | null>(null);
  const [invitedGuests, setInvitedGuests] = useState<MemberProps[]>([]);

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

  //초기화

  const handleInputDetected = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    //한글,영어만 입력되도록, 공백포함 17글자
    input = input.slice(0, 17);
    const filtered = input.replace(
      /[^가-힣a-zA-Z\s\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/g,
      "",
    );
    setLocalName(filtered);
  };

  const { setValue, watch } = useForm({
    defaultValues: {
      levelOptions: "",
    },
  });

  const levelValue = watch("levelOptions") || "";

  const isFormValid =
    (localName.length > 0 && selected !== null && levelValue === "disabled") ||
    levelOptions.includes(levelValue);

  useEffect(() => {
    console.log(invitedGuests);
  }, [invitedGuests]);
  //클릭
  const handleInvite = () => {
    if (!isFormValid) return;

    const newGuest: MemberProps = {
      name: localName,
      gender: selected as "male" | "female",
      level: levelValue === "disabled" ? "급수 없음" : levelValue,
      status: "waiting",
    };

    setInvitedGuests(prev => [...prev, newGuest]);
    console.log(invitedGuests);
    // btn클릭 후 초기화
    setLocalName("");
    isSelected(null);
    setValue("levelOptions", "");
  };

  const femaleCount = invitedGuests.filter(
    item => item.gender === "female",
  ).length;
  const maleCount = invitedGuests.filter(item => item.gender === "male").length;
  return (
    <>
      <div className="flex flex-col justify-between -mb-8 ">
        <PageHeader title="게스트 초대하기" />
        <div className="flex flex-col gap-15">
          <section className="text-left flex flex-col  gap-3 w-full pt-10">
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
                <img src={Circle_Red} alt="icon-cicle" />
              </div>
              <div className="flex gap-[13px]">
                <TextBox
                  children="남성"
                  isSelected={selected === "male"}
                  onClick={() =>
                    isSelected(selected === "male" ? null : "male")
                  }
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
            <DropCheckBox
              title="전국 급수"
              options={levelOptions}
              checkLabel="급수 없음"
              value={levelValue}
              checked={levelValue === "disabled"}
              onChange={val =>
                setValue("levelOptions", val ?? "", { shouldValidate: true })
              }
            />
          </section>

          {/* 대기열 */}
          <section>
            {/* 참여 인원 :  사용자가 초대한 총 인원 수*/}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-left header-h5">참여 인원</label>
                  <p className="header-h5">{invitedGuests.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Female className="w-4 h-4" />
                  <p className="body-rg-500">{femaleCount}</p>
                  <Male className="w-4 h-4" />
                  <p className="body-rg-500">{maleCount}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center flex-col">
              {invitedGuests.map((guest, idx) => (
                <Member key={idx} {...guest} />
              ))}
            </div>
          </section>
        </div>
        {/* 버튼 */}
        <div
          className="flex  justify-center  mt-25 mb-4"
          onClick={handleInvite}
        >
          <Btn_Static
            label="초대하기"
            kind="GR400"
            size="L"
            initialStatus={!isFormValid ? "disabled" : "default"}
          />
        </div>
      </div>
    </>
  );
};
