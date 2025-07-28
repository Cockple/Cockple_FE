import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import InputSlider from "../../components/common/Search_Filed/InputSlider";
import InputField from "../../components/common/Search_Filed/InputField";

export const GroupFilter = () => {
  const navigate = useNavigate();

  const isFormValid = "";

  const handleNext = () => {
    navigate("/group/level");
  };
  const [kock, setKock] = useState("");
  const [joinMoney, setJoinMoney] = useState<string>("");
  const [money, setMoney] = useState<string>("");
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
    const commaMoney = Number(filtered).toLocaleString();
    setMoney(commaMoney);
  };

  const handleBlur = () => {
    if (money) {
      setMoney(prev => `${prev}원`);
    }
  };

  const handleFocus = () => {
    // 원 제거
    if (money.endsWith("원")) {
      setMoney(money.replace("원", ""));
    }
  };

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
            <InputField
              labelName="지정콕"
              InputMaxLength={20}
              InputLength={kock.length}
              value={kock}
              onChange={handleInputDetected}
            />
          </div>
          {/* 두번째 */}
          <div className="">
            <InputField
              labelName="가입비"
              onChange={handleChange}
              value={joinMoney}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
          </div>
          {/* 세번째 */}
          <div className="">
            <InputField
              labelName="회비"
              onChange={handleChange}
              value={money}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
          </div>
          {/* 네번째 */}
          <InputSlider title="나이대" />
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
