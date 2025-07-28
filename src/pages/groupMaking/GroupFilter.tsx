import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import { useGroupMakingFilterStore } from "../../zustand/useGroupMakingFilter";
import { CheckBox_Long } from "../../components/common/CheckBox_Long";
import { CheckBox_dismiss_truncate } from "../../components/common/CheckBox_dismiss_truncate";
import InputSlider from "../../components/common/Search_Filed/InputSlider";

export const GroupFilter = () => {
  const navigate = useNavigate();

  //store
  const { weekly, time } = useGroupMakingFilterStore();
  //정보

  //초기화

  const isFormValid = "";

  const handleNext = () => {
    navigate("/group/level");
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
            <CheckBox_Long maxLength={20} title="지정콕" />
          </div>
          {/* 두번째 */}
          <div className="mb-4">
            <CheckBox_dismiss_truncate title="가입비" />
          </div>
          {/* 세번째 */}
          <div className="mb-4">
            <CheckBox_dismiss_truncate title="회비" />
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
