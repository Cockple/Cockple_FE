import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import DropCheckBox from "../../components/common/Drop_Box/DropCheckBox";
import IntroText from "../../components/onboarding/IntroText";
import { useForm } from "react-hook-form";
import { useOnboardingState } from "../../store/useOnboardingStore";
import { LEVEL_KEY } from "../../constants/options";

export const OnboardingLevelPage = () => {
  const navigate = useNavigate();
  const { level, setTemp } = useOnboardingState();

  const { setValue, watch } = useForm({
    defaultValues: {
      LEVEL_KEY: level ?? "",
    },
  });

  const levelValue = watch("LEVEL_KEY") || "";
  const isFormValid =
    levelValue === "disabled" || LEVEL_KEY.includes(levelValue);

  const handleNext = () => {
    setTemp({
      level: levelValue,
    });
    navigate("/onboarding/address");
  };

  return (
    <div
      className="w-full flex flex-col -mb-8 pt-14"
      style={{ minHeight: "100dvh" }}
    >
      <PageHeader title="회원 정보 입력" />
      <ProgressBar width={!isFormValid ? "28" : "48"} />

      <section className="flex gap-8 text-left flex-col flex-1 ">
        <IntroText
          title="전국 급수를 입력해주세요."
          text1="급수를 입력하면,"
          text2="내 실력에 맞는 모임을 추천받을 수 있어요!"
          isBar={true}
        />

        <DropCheckBox
          title="전국 급수"
          options={LEVEL_KEY.slice(1)}
          checkLabel="급수 없음"
          value={levelValue}
          checked={levelValue === "disabled"}
          onChange={val =>
            setValue("LEVEL_KEY", val ?? "", { shouldValidate: true })
          }
        />
      </section>
      <div
        className="flex items-center justify-center mb-6"
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
  );
};
