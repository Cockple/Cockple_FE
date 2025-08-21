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

  return data?.list.map((item: ResponseInviteGuest) => {
    const apilevel = toKor(item.level);
    console.log(data);
    const responseLevelValue =
      apilevel === "disabled"
        ? "급수 없음"
        : ["A조", "B조", "C조", "D조"].includes(apilevel)
          ? `전국 ${apilevel}`
          : apilevel;
    const numberStatus = item.isWaiting ? "waiting" : "Participating";
    const apiNumber = item.participantNumber;
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
        onDelete={() => handleDelete.mutate(item.guestId)}
      />
    );
  });
}
