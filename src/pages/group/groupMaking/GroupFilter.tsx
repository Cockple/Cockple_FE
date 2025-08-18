import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../../components/common/ProgressBar";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";
import InputSlider from "../../../components/common/Search_Filed/InputSlider";
import CheckBoxInputFiled from "../../../components/group/groupMaking/CheckBoxInputField";
import { useGroupMakingFilterStore } from "../../../store/useGroupMakingFilter";
import { useMyProfile } from "../../../api/member/my";
import { handleInput } from "../../../utils/handleDetected";
import { addWon, fmtKRW, stripWon } from "../../../utils/moneychange";

export const GroupFilter = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    if (myYear >= apiAgeRange[0] && myYear <= apiAgeRange[1]) {
      navigate("/group/making/select");
    } else {
      alert("본인 나이를 포함해서 선택해주세요.");
    }
  };

  const currentYear = new Date().getFullYear();

  const setFilter = useGroupMakingFilterStore(state => state.setFilter);
  const apiAgeRange = useGroupMakingFilterStore(state => state.ageRange);

  const { data: me } = useMyProfile();

  const myYear = me?.birth.split("-")[0]; //내 년도

  const {
    money,
    joinMoney,
    kock,
    ageRange: storeAgeRange,
  } = useGroupMakingFilterStore();
  const minYear = currentYear - 75;
  const maxYear = currentYear - 10;
  const isAgeRangeFilled = storeAgeRange.length === 2;

  const [ageRange, setAgeRange] = useState<number[]>(
    isAgeRangeFilled ? storeAgeRange : [minYear, maxYear],
  );

  //슬라이드
  const [ageTouched, setAgeTouched] = useState(isAgeRangeFilled);
  //유효성
  const handleInputDetected = handleInput(20, v => {
    setFilter("kock", v);
  });

  // 핸들러
  const moneyHandlers = (key: "money" | "joinMoney", value: string) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(key, fmtKRW(e.target.value));
    },
    onBlur: () => {
      if (value && value !== "0") setFilter(key, addWon(value));
    },
    onFocus: () => {
      if (value?.endsWith?.("원")) {
        const plain = stripWon(value);
        setFilter(key, fmtKRW(plain));
      }
    },
  });
  const moneyH = moneyHandlers("money", money);
  const joinMoneyH = moneyHandlers("joinMoney", joinMoney);

  const isFormValid =
    (kock.length > 0 || kock === "disabled") &&
    (joinMoney.length > 0 || joinMoney === "disabled") &&
    (money.length > 0 || money === "disabled") &&
    ageTouched;

  return (
    <>
      <div className="flex flex-col -mb-8 " style={{ minHeight: "91dvh" }}>
        <PageHeader title="회원 정보 입력" />
        <ProgressBar width={!isFormValid ? "52" : "72"} />

        <section className="text-left flex flex-col  gap-3 w-full mb-6 flex-1">
          <p className="header-h4 pt-8 pb-5">
            모임 지정콕,조건 정보를 입력해주세요
          </p>
          {/* 첫번째 */}
          <div>
            <CheckBoxInputFiled
              value={kock}
              checkLabel="없음"
              onChange={handleInputDetected}
              labelName="지정콕"
              InputMaxLength={20}
              InputLength={kock.length}
              checked={kock === "disabled"}
              onCheckChange={checked => {
                setFilter("kock", checked ? "disabled" : "");
              }}
            />
          </div>
          {/* 두번째 */}
          <CheckBoxInputFiled
            value={joinMoney}
            checkLabel="없음"
            onChange={joinMoneyH.onChange}
            onBlur={joinMoneyH.onBlur}
            onFocus={joinMoneyH.onFocus}
            labelName={"가입비"}
            checked={joinMoney === "disabled"}
            onCheckChange={checked => {
              setFilter("joinMoney", checked ? "disabled" : "");
            }}
          />
          {/* 세번째 */}
          <CheckBoxInputFiled
            value={money}
            checkLabel="없음"
            onChange={moneyH.onChange}
            onBlur={moneyH.onBlur}
            onFocus={moneyH.onFocus}
            labelName={"회비"}
            checked={money === "disabled"}
            onCheckChange={checked => {
              setFilter("money", checked ? "disabled" : "");
            }}
          />
          {/* 네번째 */}
          <InputSlider
            title="나이대"
            minYear={minYear}
            maxYear={maxYear}
            values={ageRange}
            onChange={vals => {
              setAgeRange(vals);
              setFilter("ageRange", vals);
              if (!ageTouched) setAgeTouched(true);
            }}
          />
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-5 sm:mb-4.5  shrink-0 `}
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
