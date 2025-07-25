import Clear_XS from "../../components/common/Btn_Static/Icon_Btn/Clear_XS";
import White_L_Test from "../../components/common/Btn_Static/Text/White_L_Test";
import { Group_S } from "../../components/common/contentcard/Group_S";
import { MainHeader } from "../../components/common/system/header/MainHeader";
import ArrowRight from "@/assets/icons/arrow_right.svg";
import {
  groupExerciseData,
  RecommendGroupData,
  type IFMyGroupData,
} from "../../components/home/mock/homeMock";
import { Group_M } from "../../components/common/contentcard/Group_M";
import { Empty } from "../../components/group/main/Empty";
import AddIcon from "@/assets/icons/add.svg";
import { useNavigate } from "react-router-dom";
import { useGroupRecommendFilterState } from "../../store/useGroupRecommendFilterStore";

export const GroupPage = () => {
  const navigate = useNavigate();
  const data: IFMyGroupData[] = groupExerciseData;
  const recommendDate = RecommendGroupData;
  const { resetFilter } = useGroupRecommendFilterState();

  const onClickGroupRecommend = () => {
    resetFilter();
    navigate("/group/recommend");
  };
  return (
    <div className="flex flex-col">
      <MainHeader />
      <div className="flex flex-col mt-5 gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between header-h4 ">
            내 모임
            {data && data.length > 0 && (
              <Clear_XS
                iconMap={{
                  disabled: ArrowRight,
                  default: ArrowRight,
                  pressing: ArrowRight,
                  clicked: ArrowRight,
                }}
              />
            )}
          </div>

          <div className="flex gap-1 overflow-x-scroll scrollbar-hide">
            {data && data.length > 0 ? (
              <>
                <White_L_Test label="모임 만들기" icon={AddIcon} />
                {data &&
                  data.map(item => (
                    <div onClick={() => navigate(`/group/${item.id}`)}>
                      <Group_S
                        key={item.id}
                        title={item.title}
                        location={item.location}
                        imageSrc={item.imgSrc}
                      />
                    </div>
                  ))}
              </>
            ) : (
              <Empty />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between header-h4 ">
            모임 추천{" "}
            <Clear_XS
              iconMap={{
                disabled: ArrowRight,
                default: ArrowRight,
                pressing: ArrowRight,
                clicked: ArrowRight,
              }}
              onClick={onClickGroupRecommend}
            />
          </div>

          <div className="flex flex-col gap-2">
            {recommendDate &&
              recommendDate.map(item => (
                <Group_M
                  id={item.id}
                  groupName={item.groupName}
                  location={item.location}
                  femaleLevel={item.femaleLevel}
                  maleLevel={item.maleLevel}
                  nextActivitDate={item.nextActivitDate}
                  groupImage={item.groupImage}
                  upcomingCount={item.upcomingCount}
                  isMine={true}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
