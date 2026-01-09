import InviteGuestItem from "@/components/group/InviteGuestItem";
import Female from "@/assets/icons/female.svg?react";
import Male from "@/assets/icons/male.svg?react";
import { useInviteGuest } from "@/api/exercise/InviteGuestApi";
import type { ResponseInviteGuest } from "@/types/guest";

interface InviteGuestListProps {
  exerciseId: number;
}

export const InviteGuesetList = ({ exerciseId }: InviteGuestListProps) => {
  const { data } = useInviteGuest(exerciseId);

  const noneData = data.list.length === 0;
  return (
    <section>
      {noneData ? (
        <div>게스트를 초대해주세요!</div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-left header-h5">초대된 인원</label>
              <p className="header-h5">{data.totalCount}</p>
            </div>
            <div className="flex items-center gap-2">
              <Female className="w-4 h-4" />
              <p className="body-rg-500">{data.femaleCount}</p>
              <Male className="w-4 h-4" />
              <p className="body-rg-500">{data.maleCount}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center flex-col">
        <div className="flex flex-col gap-2">
          {data.list.map((item: ResponseInviteGuest) => (
            <InviteGuestItem
              key={item.guestId}
              item={item}
              exerciseId={exerciseId}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
