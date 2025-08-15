import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../../components/common/ProgressBar";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";
import InputSlider from "../../../components/common/Search_Filed/InputSlider";
import CheckBoxInputFiled from "../../../components/group/groupMaking/CheckBoxInputField";
import { useGroupMakingFilterStore } from "../../../store/useGroupMakingFilter";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../../../api/member/my";

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

  const { data: me } = useQuery({
    queryKey: ["user"],
    queryFn: getMyProfile,
  });
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
  const handleInputDetected = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    //한글,영어만 입력되도록, 공백포함 17글자
    input = input.slice(0, 20);
    const filtered = input.replace(
      /[^가-힣a-zA-Z\s\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/g,
      "",
    );
    setFilter("kock", filtered);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^0-9]/g, "");
    if (filtered === "") {
      setFilter("money", "");
      return;
    }
    const commaMoney = Number(filtered).toLocaleString();
    setFilter("money", commaMoney);
  };

  const handleJoinMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^0-9]/g, "");
    if (filtered === "") {
      setFilter("joinMoney", "");
      return;
    }
    const commaMoney = Number(filtered).toLocaleString();
    setFilter("joinMoney", commaMoney);
  };

  const handleMoneyBlur = () => {
    if (money !== "0" && money) {
      setFilter("money", `${money}원`);
    }
  };

  const handleMoneyFocus = () => {
    console.log(money);
    if (money.endsWith("원")) {
      const plain = money.replace("원", "").replaceAll(",", "");
      setFilter("money", Number(plain).toLocaleString());
    }
  };
  const handleJoinMoneyBlur = () => {
    if (joinMoney !== "0" && joinMoney) {
      setFilter("joinMoney", `${joinMoney}원`);
    }
  };

  const handleJoinMoneyFocus = () => {
    console.log(joinMoney);

    if (joinMoney.endsWith("원")) {
      const plain = joinMoney.replace("원", "").replaceAll(",", "");
      setFilter("joinMoney", Number(plain).toLocaleString());
    }
  };

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
            onChange={handleJoinMoneyChange}
            onBlur={handleJoinMoneyBlur}
            onFocus={handleJoinMoneyFocus}
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
            onChange={handleChange}
            onBlur={handleMoneyBlur}
            onFocus={handleMoneyFocus}
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
          className={`flex items-center justify-center mb-4  shrink-0 `}
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
