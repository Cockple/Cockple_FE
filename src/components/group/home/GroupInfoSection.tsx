import { useState, useMemo } from "react";
import FemaleIcon from "@/assets/icons/female.svg?react";
import MaleIcon from "@/assets/icons/male.svg?react";
import White_XS from "../../common/Btn_Static/Text/White_XS";
import UpIcon from "@/assets/icons/arrow_up.svg?url";
import DownIcon from "@/assets/icons/arrow_down.svg?url";
import HashIcon from "@/assets/icons/hash.svg?url";
import CautionIcon from "@/assets/icons/caution.svg?url";
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";
import { GroupInfoList } from "./GroupInfoList";
import type { PartyDetailResponse } from "../../../api/exercise/getpartyDetail";

const formatActivityDays = (days?: string[] | null) =>
  Array.isArray(days) ? days.join(" ") : "";

const toLevelString = (arr?: string[] | null) => {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  if (arr.length === 1) return `${arr[0]} 이상`;
  return `${arr[0]} ~ ${arr[arr.length - 1]}`;
};

const LevelBlock = ({
  female,
  male,
}: {
  female?: string[] | null;
  male?: string[] | null;
}) => {
  const femaleText = toLevelString(female);
  const maleText = toLevelString(male);
  if (!femaleText && !maleText) return null;
  return (
    <div className="flex flex-col gap-1">
      {femaleText && (
        <div className="flex gap-1 items-center">
          <FemaleIcon />
          <span>{femaleText}</span>
        </div>
      )}
      {maleText && (
        <div className="flex gap-1 items-center">
          <MaleIcon />
          <span>{maleText}</span>
        </div>
      )}
    </div>
  );
};

interface GroupInfoSectionProps {
  partyDetail: PartyDetailResponse;
}

export const GroupInfoSection = ({ partyDetail }: GroupInfoSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const items = useMemo(
    () => [
      {
        label: "지역",
        value: `${partyDetail.addr1} / ${partyDetail.addr2}`,
      },
      { label: "날짜", value: formatActivityDays(partyDetail.activityDays) },
      { label: "시간", value: partyDetail.activityTime ?? "" },
      {
        label: "급수",
        value: (
          <LevelBlock
            female={partyDetail.femaleLevel}
            male={partyDetail.maleLevel}
          />
        ),
      },
      {
        label: "나이",
        value:
          partyDetail.minBirthYear && partyDetail.maxBirthYear
            ? `${partyDetail.minBirthYear} ~ ${partyDetail.maxBirthYear}`
            : "",
      },
      { label: "회비", value: partyDetail.price ?? "" },
      { label: "가입비", value: partyDetail.joinPrice ?? "" },
      {
        label: "지정콕",
        value: partyDetail.designatedCock ? partyDetail.designatedCock : "없음",
      },
    ],
    [partyDetail],
  );

  const visibleItems = isExpanded ? items : items.slice(0, 4);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex p-3 gap-3">
        <div className="w-30 h-30 border-hard shrink-0 overflow-hidden flex items-center relative bg-gy-100">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gy-100 animate-pulse" />
          )}
          <img
            src={partyDetail.partyImgUrl ?? DefaultGroupImg}
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="body-rg-500 text-left mb-2">
            {partyDetail.partyName}
          </div>

          <div className="flex flex-col gap-2">
            {visibleItems.map(item => (
              <GroupInfoList items={item} key={item.label} />
            ))}
          </div>

          <div className="relative z-10">
            {!isExpanded && (
              <div className="absolute bottom-8 left-0 right-0 h-16 bg-[linear-gradient(180deg,rgba(252,252,255,0)_0%,rgba(252,252,255,0.8)_50%,#FCFCFF_90%)] pointer-events-none z-0" />
            )}
            <White_XS
              label={isExpanded ? "간략하게" : "더보기"}
              icon={isExpanded ? UpIcon : DownIcon}
              onClick={() => setIsExpanded(prev => !prev)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {partyDetail.keywords && partyDetail.keywords.length > 0 && (
        <div className="flex gap-3 overflow-x-scroll whitespace-nowrap scrollbar-hide">
          {partyDetail.keywords.map((kw: string, idx: number) => (
            <div
              className="inline-flex items-center gap-1 rounded-full py-2 pl-2.5 pr-3 border-1 border-gy-200 shadow-ds50 body-rg-500"
              key={`${kw}-${idx}`}
            >
              <img src={HashIcon} className="w-4 h-4 shrink-0" />
              <span>{kw}</span>
            </div>
          ))}
        </div>
      )}

      {partyDetail.content && (
        <div className="w-full p-4 flex items-center gap-2 border-1 border-gr-500 border-soft">
          <img src={CautionIcon} className="size-5" />
          <div className="text-left body-rg-500">{partyDetail.content}</div>
        </div>
      )}
    </div>
  );
};
