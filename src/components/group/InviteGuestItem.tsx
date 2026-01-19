import { useDeleteInviteForm } from "@/api/exercise/InviteGuestApi";
import type { ResponseInviteGuest } from "@/types/guest";
import { userLevelMapper } from "@/utils/levelValueExchange";
import { Member } from "@/components/common/contentcard/Member";
const { toKor } = userLevelMapper();

type InviteGuestProps = {
  item: ResponseInviteGuest;
  exerciseId: number;
};

export default function InviteGuestItem({
  item,
  exerciseId,
}: InviteGuestProps) {
  console.log(item);
  const handleDelete = useDeleteInviteForm(exerciseId);
  const apilevel = toKor(item.level);
  const responseLevelValue =
    apilevel === "disabled"
      ? "급수 없음"
      : ["A조", "B조", "C조", "D조"].includes(apilevel)
        ? `전국 ${apilevel}`
        : apilevel;
  const numberStatus = item.isWaiting ? "waiting" : "Participating";
  const apiNumber = item.isWaiting
    ? `대기.${item.participantNumber}`
    : `No.${item.participantNumber}`;
  //운동 상세 조회

  return (
    <Member
      key={item.guestId}
      status={numberStatus}
      {...item}
      guestName={item.inviterName}
      gender={item.gender.toUpperCase() as "MALE" | "FEMALE"}
      number={apiNumber}
      level={responseLevelValue}
      showDeleteButton={true}
      useDeleteModal={false}
      isGuest={true}
      guestNumber={true}
      onDelete={() => handleDelete.mutate(item.guestId)}
    />
  );
}
