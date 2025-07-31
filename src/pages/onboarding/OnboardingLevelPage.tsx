import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import DropCheckBox from "../../components/common/Drop_Box/DropCheckBox";
import IntroText from "../../components/onboarding/IntroText";
import { useForm } from "react-hook-form";
import { useOnboardingState } from "../../zustand/useOnboardingStore";

export const OnboardingLevelPage = () => {
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
  const navigate = useNavigate();
  const { level, setTemp } = useOnboardingState();

  const {
    // register,
    setValue,
    watch,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      levelOptions: level ?? "",
    },
  });

  // console.log(level);

  const levelValue = watch("levelOptions") || "";
  const isFormValid =
    levelValue === "disabled" || levelOptions.includes(levelValue);

  const handleNext = () => {
    setTemp({
      level: levelValue,
    });
    navigate("/onboarding/address");
  };

  return (
    <div className="w-full flex flex-col -mb-8">
      <PageHeader title="회원 정보 입력" />
      <ProgressBar width={!isFormValid ? "28" : "48"} />

      <section className="flex gap-8 text-left flex-col pb-67 ">
        <IntroText
          title="전국 급수를 입력해주세요."
          text1="급수를 입력하면,"
          text2="내 실력에 맞는 모임을 추천받을 수 있어요!"
          isBar={true}
        />

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
      <div
        className="flex items-center justify-center pt-[1px]"
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
