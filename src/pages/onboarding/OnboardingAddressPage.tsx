import { useForm } from "react-hook-form";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import SearchField from "../../components/common/Search_Filed/SearchField";
import { ProgressBar } from "../../components/common/ProgressBar";
import IntroText from "../../components/onboarding/IntroText";

export const OnboardingAddressPage = () => {
  const {
    // data,
    register,
    // handleSubmit,
    // setValue,
    // formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col">
      <PageHeader title="회원 정보 입력" />
      <ProgressBar width="52" />

      <section className="flex gap-8 text-left flex-col flex-1">
        <IntroText
          title="위치 정보를 입력해주세요."
          text1="위치 정보를 입력하면,"
          text2="가까운 거리의 모임을 추천받을 수 있어요!"
          isBar={true}
        />

        <SearchField
          register={register("location")}
          label="위치"
          onSearchClick={() => navigate("/myPage/edit/location")}
        />
      </section>
    </div>
  );
};
