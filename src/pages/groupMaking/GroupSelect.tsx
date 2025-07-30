import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import SingleImageUploadBtn from "./components/SingleImgUploadBtn";
import InputField from "../../components/common/Search_Filed/InputField";
import { useState } from "react";

export const GroupSelect = () => {
  const [text, setText] = useState<string>();

  const navigate = useNavigate();

  const handleInputDetected = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    input = input.slice(0, 45);
    const filterd = input.replace(
      /[^가-힣a-zA-Z\s\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/g,
      "",
    );
    setText(filterd);
  };

  const handleNext = () => {
    navigate("/confirm", {
      state: {
        onboarding: false,
      },
    });
  };

  const isFormValid = "";
  return (
    <>
      <div className="flex flex-col -mb-8">
        <PageHeader title="모임 만들기" />
        <ProgressBar width={!isFormValid ? "76" : "96"} />

        <section className="text-left flex flex-col  gap-4 w-full mb-6">
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
            />
          </div>
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-4 mt-38 shrink-0 `}
          onClick={handleNext}
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
