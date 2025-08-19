import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { ProgressBar } from "../../../components/common/ProgressBar";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";
import SingleImageUploadBtn from "../../../components/group/groupMaking/SingleImgUploadBtn";
import InputField from "../../../components/common/Search_Filed/InputField";
import { useGroupMakingFilterStore } from "../../../store/useGroupMakingFilter";
import { usePostGroupMaking } from "../../../api/party/groupMaking";
import { useGroupMakingPayload } from "../../../hooks/useGroupMakingPayLoad";

export const GroupSelect = () => {
  const { content, setFilter } = useGroupMakingFilterStore();
  const payload = useGroupMakingPayload();
  const mutation = usePostGroupMaking();

  const handleInputDetected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter("content", e.target.value.slice(0, 45));
  };
  const handleMakingGroupForm = () => {
    mutation.mutate(payload);
  };

  return (
    <>
      <div className="flex flex-col -mb-8 pt-14 min-h-dvh">
        <PageHeader title="모임 만들기" />
        <ProgressBar width={"96"} />

        <section className="text-left flex flex-col  gap-4 w-full mb-6 flex-1">
          <p className="header-h4 pt-8 pb-5">모임 선택 정보를 입력해주세요.</p>
          {/* 첫번째 */}
          <div className="flex flex-col gap-8">
            <SingleImageUploadBtn />

            <InputField
              isRequired={false}
              labelName="멤버에게 하고 싶은 말 / 소개"
              InputMaxLength={45}
              InputLength={content?.length}
              onChange={handleInputDetected}
              value={content}
              isTextArea={true}
            />
          </div>
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-6 shrink-0 `}
          onClick={handleMakingGroupForm}
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
