import type { ResponseInviteGuest } from "../../types/guest";
import { userLevelMapper } from "../../utils/levelValueExchange";
import { Member } from "../common/contentcard/Member";
import { useDeleteInviteForm } from "../../api/Exercise/InviteGuest";
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

  return data?.list.map((item: ResponseInviteGuest, idx: number) => {
    const apilevel = toKor(item.level);
    const responseLevelValue = apilevel === "disabled" ? "급수 없음" : apilevel;
    const watiingNum =
      idx <= 9
        ? (idx + 1).toString().padStart(2, "0")
        : String(item.participantNumber).toString().padStart(2, "0");

    const numberStatus = idx <= 9 ? "Participating" : "waiting";
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
