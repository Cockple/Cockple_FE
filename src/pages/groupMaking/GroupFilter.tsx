import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import InputSlider from "../../components/common/Search_Filed/InputSlider";
import CheckBoxInputFiled from "../../components/common/Search_Filed/CheckBoxInputField";

export const GroupFilter = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/group/level");
  };
  const currentYear = new Date().getFullYear();

  const minYear = currentYear - 75;
  const maxYear = currentYear - 10;
  const [kock, setKock] = useState("");
  const [joinMoney, setJoinMoney] = useState<string>("");
  const [money, setMoney] = useState<string>("");
  const [ageRange, setAgeRange] = useState<number[]>([minYear, maxYear]);
  //슬라이드
  const [ageTouched, setAgeTouched] = useState(false);
  const handleInputDetected = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    //한글,영어만 입력되도록, 공백포함 17글자
    input = input.slice(0, 20);
    const filtered = input.replace(
      /[^가-힣a-zA-Z\s\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/g,
      "",
    );
    setKock(filtered);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^0-9]/g, "");
    if (filtered === "") {
      setJoinMoney(""); // 비우기
      return;
    }
    const commaMoney = Number(filtered).toLocaleString();
    setMoney(commaMoney);
  };

  const handleJoinMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^0-9]/g, "");
    if (filtered === "") {
      setJoinMoney(""); // 비우기
      return;
    }
    const commaMoney = Number(filtered).toLocaleString();
    setJoinMoney(commaMoney);
  };

  const handleMoneyBlur = () => {
    if (money !== "0" && money) {
      setMoney(prev => `${prev}원`);
    }
  };

  const handleMoneyFocus = () => {
    if (money.endsWith("원")) {
      setMoney(money.replace("원", ""));
    }
  };
  const handleJoinMoneyBlur = () => {
    if (joinMoney !== "0" && joinMoney) {
      setJoinMoney(prev => `${prev}원`);
    }
  };

  const handleJoinMoneyFocus = () => {
    if (joinMoney.endsWith("원")) {
      setJoinMoney(joinMoney.replace("원", ""));
    }
  };
  const isFormValid =
    (kock.length > 0 || kock === "disabled") &&
    (joinMoney.length > 0 || joinMoney === "disabled") &&
    (money.length > 0 || money === "disabled") &&
    ageTouched;

  return (
    <>
      <div className="flex flex-col -mb-8">
        <PageHeader title="회원 정보 입력" />
        <ProgressBar width={!isFormValid ? "28" : "48"} />

        <section className="text-left flex flex-col  gap-4 w-full mb-6">
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
                setKock(checked ? "disabled" : "");
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
              setJoinMoney(checked ? "disabled" : "");
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
              setMoney(checked ? "disabled" : "");
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
              if (!ageTouched) setAgeTouched(true);
            }}
          />
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-4 mt-1 shrink-0 `}
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
