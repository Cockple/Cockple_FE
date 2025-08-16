import ImgNoneError from "@/assets/images/None_Error.png?url";
import GR400_M from "../common/Btn_Static/Text/GR400_M";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
type Kind = "group" | "exercise";

interface Props {
  kind: Kind; // 'group' | 'exercise'
}

export const LikedEmptyState = ({ kind }: Props) => {
  const navigate = useNavigate();

  const copy = useMemo(() => {
    return kind === "group"
      ? {
          title: "찜한 모임이 없어요!",
          sub: "모임을 찜하고 배드민턴을 즐겨볼까요?",
          cta: "모임 추천받기",
          to: "/group/recommend",
        }
      : {
          title: "찜한 운동이 없어요!",
          sub: "운동을 찜하고 배드민턴을 즐겨볼까요?",
          cta: "운동 추천받기",
          to: "/recommend",
        };
  }, [kind]);
  return (
    <div className="flex flex-col items-center justify-center px-2 gap-[var(--Gaps-Vertical-Section_S, 1.25rem)]">
      {/* <div className="w-[11.25rem] h-[11.25rem] bg-gy-100 flex items-center justify-center text-center header-h5 text-black px-[2.41rem]">
        이모티콘 캐릭터
        <br />
        삽입 예정
      </div> */}

      <div className="header-h5">
        {copy.title} <br /> {copy.sub}를 찜하고 배드민턴을 즐겨볼까요?
      </div>

      {/* 🌟이미지 추가 */}
      <img
        src={ImgNoneError}
        alt="empty-state"
        className="w-[11.25rem] h-[11.25rem] object-contain"
      />
      <GR400_M label={copy.cta} onClick={() => navigate(copy.to)} />
    </div>
  );
};
