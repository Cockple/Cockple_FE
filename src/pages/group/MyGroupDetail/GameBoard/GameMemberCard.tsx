import clsx from "clsx";
import DefaultProfile from "@/assets/images/base_profile_img.png";
import Female from "@/assets/icons/female.svg";
import Male from "@/assets/icons/male.svg";
import CircleS from "@/assets/icons/circle_s.svg";
import Exercise from "@/assets/icons/Exercise.svg";
import ExerciseFilled from "@/assets/icons/Exercise_filled.svg";
import type { GameMember, MemberTag } from "./mockGameBoardData";

const TAG_STYLE: Record<MemberTag, string> = {
  운동: "bg-gr-100 text-gr-700",
  대기: "bg-[#fff4d2] text-[#d96303]",
  미참여: "bg-rd-500 text-white",
};

interface GameMemberCardProps {
  member: GameMember;
  selected: boolean;
  onToggleSelect: () => void;
}

export const GameMemberCard = ({
  member,
  selected,
  onToggleSelect,
}: GameMemberCardProps) => {
  const { name, gender, ageGroup, group, playCount, tags, imgUrl, selectable } =
    member;
  const isWithdrawn = tags.includes("미참여");

  return (
    <div
      className={clsx(
        "flex w-[10.3125rem] flex-col gap-2 rounded-2xl p-2 shadow-ds100",
        isWithdrawn ? "bg-gy-100 opacity-50" : "bg-white",
      )}
    >
      <div className="flex h-6 items-center justify-between pl-1">
        <div className="flex items-start gap-1">
          {tags.map(tag => (
            <span
              key={tag}
              className={clsx(
                "flex items-center justify-center rounded-lg px-1 py-0.5 body-sm-500",
                TAG_STYLE[tag],
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="flex items-center justify-center rounded-lg bg-gy-100 px-1 py-0.5 body-sm-500 text-gy-700">
          {playCount}회
        </span>
      </div>

      <div className="flex items-center gap-2">
        <img
          src={imgUrl ?? DefaultProfile}
          alt={`${name} 프로필`}
          className={clsx(
            "size-6 rounded-full object-cover",
            isWithdrawn && "opacity-20",
          )}
        />
        <span className="header-h5 truncate text-black">{name}</span>
      </div>

      <div className="flex items-center justify-center gap-1">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <img
            src={gender === "FEMALE" ? Female : Male}
            alt=""
            className="size-4 shrink-0"
          />
          <span className="body-sm-500 text-black">{group}</span>
          <img src={CircleS} alt="" className="size-2 shrink-0" />
          <span className="body-sm-500 whitespace-nowrap text-black">
            {ageGroup}
          </span>
        </div>
        <button
          type="button"
          disabled={!selectable}
          className={clsx(
            "flex size-6 shrink-0 items-center justify-center rounded-lg p-1",
            selectable ? "bg-white/50" : "bg-transparent",
          )}
          onClick={e => {
            e.stopPropagation();
            onToggleSelect();
          }}
        >
          <img
            src={selected ? ExerciseFilled : Exercise}
            alt="선택"
            className="size-4"
          />
        </button>
      </div>
    </div>
  );
};
