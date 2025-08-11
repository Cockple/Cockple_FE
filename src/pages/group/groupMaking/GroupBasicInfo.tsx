import { PageHeader } from "../../../components/common/system/header/PageHeader";
import TextBox from "../../../components/common/Text_Box/TextBox";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../../components/common/ProgressBar";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";
import InputField from "../../../components/common/Search_Filed/InputField";
import { MultiSelectButtonGroup } from "../../../components/common/MultiSelectButtonGroup";
import { useGroupMakingFilterStore } from "../../../store/useGroupMakingFilter";
import { Modal_Caution } from "../../../components/MyPage/Modal_Caution";
import Circle_Red from "@/assets/icons/cicle_s_red.svg?url";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../../../api/member/my";
import { userLevelMapper } from "../../../utils/levelValueExchange";

export const GroupBasicInfo = () => {
  const navigate = useNavigate();

  //store
  const { femaleLevel, setFilter, maleLevel } = useGroupMakingFilterStore();
  const { toKor } = userLevelMapper();
  const name = useGroupMakingFilterStore(state => state.name);
  const selected = useGroupMakingFilterStore(state => state.type);
  //정보
  const [localName, setLocalName] = useState(name ?? "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleConfirmLeave = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleCancelLeave = () => {
    setIsModalOpen(false);
  };

  const onBackClick = () => {
    setIsModalOpen(true);
  };

  //본인 level포함 안되면 ..

  const isFormValid =
    localName.length > 0 &&
    selected !== null &&
    ((selected === "female" && femaleLevel.length > 0) ||
      (selected === "mixed" && femaleLevel.length > 0 && maleLevel.length > 0));

  const handleInputDetected = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    //한글,영어만 입력되도록, 공백포함 17글자
    input = input.slice(0, 17);
    const filtered = input.replace(
      /[^가-힣a-zA-Z\s\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/g,
      "",
    );
    setLocalName(filtered);
    setFilter("name", filtered);
  };

  //내 프로필 가져오기
  const { data: me, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getMyProfile,
  });
  const gender = me?.gender;
  const isMale = gender === "MALE";
  const myKorLevel = me ? toKor(me.level) : undefined;
  const ANY = "전체";
  const containsMy = (arr: string[], my?: string) => {
    if (!my) return false;
    return arr.includes(ANY) || arr.includes(my);
  };

  // “전체면 무시 + 성별쪽만 체크”
  const passesMyLevelRule = () => {
    if (!me || !myKorLevel) return false;

    if (selected === "female") {
      //  여자 급수만 검증
      return containsMy(femaleLevel, myKorLevel);
    }
    if (selected === "mixed") {
      // 혼복: 본인 성별 쪽만 검증, 반대쪽은 아무거나 OK
      return isMale
        ? containsMy(maleLevel, myKorLevel)
        : containsMy(femaleLevel, myKorLevel);
    }
    return false;
  };
  const handleNext = () => {
    if (isLoading || !me) {
      alert("내 프로필을 불러오는 중입니다. 잠시만 기다려주세요.");
      return;
    }
    if (!isFormValid) return;

    if (!passesMyLevelRule()) {
      alert("본인 급수를 포함해서 선택해주세요.");
      return;
    }
    navigate("/group/making/activity");
  };
  return (
    <>
      <div className="flex flex-col -mb-8 " style={{ minHeight: "91dvh" }}>
        <PageHeader title="모임 만들기" onBackClick={onBackClick} />
        <ProgressBar width={!isFormValid ? "4" : "24"} />
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <Modal_Caution
              onConfirm={handleConfirmLeave}
              onCancel={handleCancelLeave}
            />
          </div>
        )}

        <section className="text-left flex flex-col  gap-3 w-full mb-6 flex-1">
          <p className="header-h4 pt-8 pb-5">모임 기본 정보를 입력해주세요.</p>
          {/* 첫번째 */}
          <InputField
            labelName="모임 이름"
            value={localName}
            InputLength={localName.length}
            onChange={handleInputDetected}
          />

          {/* 두번째 */}
          <div className="text-left flex flex-col gap-2 pb-5">
            <div className="flex px-1 gap-[2px] items-center">
              <p className="header-h5">모임 유형</p>
              <img src={Circle_Red} alt="icon-cicle" />
            </div>
            <div className="flex gap-[13px]">
              <TextBox
                children="여복"
                disabled={isMale}
                isSelected={selected === "female"}
                onClick={() =>
                  setFilter("type", selected === "female" ? "" : "female")
                }
                className="w-19"
              />
              <TextBox
                children="혼복"
                isSelected={selected === "mixed"}
                onClick={() =>
                  setFilter("type", selected === "mixed" ? "" : "mixed")
                }
                className="w-19"
              />
            </div>
          </div>
          {/* 세번째1 */}
          {selected === "female" && (
            <div>
              <div className="flex px-1 gap-[2px] items-center mb-2">
                <p className="header-h5">여자 급수</p>
                <img src={Circle_Red} alt="icon-cicle" />
              </div>
              <MultiSelectButtonGroup
                options={[
                  "전체",
                  "왕초심",
                  "초심",
                  "D조",
                  "C조",
                  "B조",
                  "A조",
                  "준자강",
                  "자강",
                ]}
                selected={femaleLevel}
                onChange={newVal => setFilter("femaleLevel", newVal)}
              />
            </div>
          )}
          {/* 세번째2 */}
          {selected === "mixed" && (
            <>
              <section className="gap-8 flex flex-col">
                <div>
                  <div className="flex px-1 gap-[2px] items-center shrink-0 mb-2">
                    <p className="header-h5">여자 급수</p>
                    <img src={Circle_Red} alt="icon-cicle" />
                  </div>
                  <MultiSelectButtonGroup
                    options={[
                      "전체",
                      "왕초심",
                      "초심",
                      "D조",
                      "C조",
                      "B조",
                      "A조",
                      "준자강",
                      "자강",
                    ]}
                    selected={femaleLevel}
                    onChange={newVal => setFilter("femaleLevel", newVal)}
                  />
                </div>
                <div>
                  <div className="flex px-1 gap-[2px] items-center mb-2">
                    <p className="header-h5">남자 급수</p>
                    <img src={Circle_Red} alt="icon-cicle" />
                  </div>
                  <MultiSelectButtonGroup
                    options={[
                      "전체",
                      "왕초심",
                      "초심",
                      "D조",
                      "C조",
                      "B조",
                      "A조",
                      "준자강",
                      "자강",
                    ]}
                    selected={maleLevel}
                    onChange={newVal => setFilter("maleLevel", newVal)}
                  />
                </div>
              </section>
            </>
          )}
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-4 mt-20  shrink-0 `}
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
