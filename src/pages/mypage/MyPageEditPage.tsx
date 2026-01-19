//마이페이지 수정 화면
import { useMyPageEdit } from "../../hooks/useMyPageEdit"; 
import { ProfileImageSection } from "@/components/MyPage/Edit/ProfileImageSection";
import { BasicInfoSection } from "@/components/MyPage/Edit/BasicInfoSection";
import { RankSection } from "@/components/MyPage/Edit/RankSection";
import { LocationSection } from "@/components/MyPage/Edit/LocationSection";
import { KeywordSection } from "@/components/MyPage/Edit/KeywordSection";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";
import { Modal_Caution } from "../../components/MyPage/Modal_Caution";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
export const MyPageEditPage = () => {
  const { state, actions, modalState } = useMyPageEdit();

  const { 
    isLoading, 
    name, 
    profileImage, 
    selectedGender, 
    selectedDate, 
    selectedLevel, 
    disabled, 
    locations, 
    selectedKeywords, 
    selectedId, 
    editMode 
  } = state;

  const { isModalOpen } = modalState;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="정보 수정하기" 
        onBackClick={actions.onBackClick} 
      />
      
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <Modal_Caution
            onConfirm={actions.handleConfirmLeave}
            onCancel={actions.handleCancelLeave}
            title="필수입력 정보가 모두 입력되지 않았어요."
            location="마이페이지로"
            alertText="계속 수정하기"
          />
        </div>
      )}

      <div className="flex flex-col">
        {/* 1. 프로필 이미지 */}
        <ProfileImageSection
          image={profileImage}
          onImageChange={actions.onFileChange}
        />

        {/* 2. 기본 정보 (이름, 성별, 생년월일) */}
        <BasicInfoSection
          name={name}
          gender={selectedGender}
          birth={selectedDate}
          onNameChange={actions.handleNameChange}
          onBirthChange={actions.setSelectedDate}
        />

        {/* 3. 급수 */}
        <RankSection
          selectedLevel={selectedLevel}
          disabled={disabled}
          onLevelChange={actions.setSelectedLevel}
          onToggleDisabled={actions.setDisabled}
        />

        {/* 4. 위치 */}
        <LocationSection
          locations={locations}
          selectedId={selectedId}
          editMode={editMode}
          toggleEditMode={actions.toggleEditMode}
          onSelectMain={actions.setSelectedId}
          onDelete={actions.handleDelete}
        />

        {/* 5. 키워드 */}
        <KeywordSection
          selectedKeywords={selectedKeywords}
          onToggleKeyword={actions.toggleKeyword}
        />

        {/* 6. 저장 버튼 */}
        <div className="mt-8 mb-8 flex justify-center">
          <Btn_Static
            kind="GR400"
            size="L"
            label="수정 완료"
            shadow="shadow-ds100"
            onClick={actions.handleSave}
          />
        </div>
      </div>
    </>
  );
};