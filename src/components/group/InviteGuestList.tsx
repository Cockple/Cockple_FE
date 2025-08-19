import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResponseInviteGuest } from "../../types/guest";
import { userLevelMapper } from "../../utils/levelValueExchange";
import { Member } from "../common/contentcard/Member";
import api from "../../api/api";
const { toKor } = userLevelMapper();

type InviteGuestProps = {
  data?: { list: ResponseInviteGuest[] };
  exerciseId: number;
};

export default function InviteGuestList({
  data,
  exerciseId,
}: InviteGuestProps) {
  //게스트 초대 취소하기--------------
  const queryClient = useQueryClient();
  const handleDelete = useMutation({
    mutationFn: (guestId: number) => {
      return api.delete(`/api/exercises/${exerciseId}/guests/${guestId}`);
    },
    onSuccess: () => {
      console.log("삭제 성공");
      queryClient.invalidateQueries({
        queryKey: ["inviteGuest", exerciseId],
      });
    },
    onError: err => {
      console.log(err);
    },
  });

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
