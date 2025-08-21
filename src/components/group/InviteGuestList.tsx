import { useGetExerciseDetail } from "../../api/exercise/exerciseApi";
import { useDeleteInviteForm } from "../../api/exercise/InviteGuestApi";
import type { ResponseInviteGuest } from "../../types/guest";
import { userLevelMapper } from "../../utils/levelValueExchange";
import { Member } from "../common/contentcard/Member";
const { toKor } = userLevelMapper();

type InviteGuestProps = {
  data?: { list: ResponseInviteGuest[] };
  exerciseId: number;
};

export default function InviteGuestList({
  data,
  exerciseId,
}: InviteGuestProps) {
  const handleDelete = useDeleteInviteForm(exerciseId);

  //운동 상세 조회
  const { data: detailData } = useGetExerciseDetail(exerciseId);
  const MaxCount = detailData?.participants?.totalCount - 1;
  return data?.list.map((item: ResponseInviteGuest, idx: number) => {
    const apilevel = toKor(item.level);

    const responseLevelValue =
      apilevel === "disabled"
        ? "급수 없음"
        : ["A조", "B조", "C조", "D조"].includes(apilevel)
          ? `전국 ${apilevel}`
          : apilevel;

    const watiingNum =
      idx <= MaxCount
        ? (idx + 1).toString()
        : String(item.participantNumber).toString();

    const numberStatus = idx <= MaxCount ? "Participating" : "waiting";
    return (
      <Member
        key={item.guestId}
        status={numberStatus}
        {...item}
        guestName={item.inviterName}
        gender={item.gender.toUpperCase() as "MALE" | "FEMALE"}
        number={watiingNum}
        level={responseLevelValue}
        showDeleteButton={true}
        useDeleteModal={false}
        isGuest={true}
        onDelete={() => handleDelete.mutate(item.guestId)}
      />
    );
  });
}
