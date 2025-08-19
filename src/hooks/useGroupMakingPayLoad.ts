import { useMemo } from "react";
import { useGroupMakingFilterStore } from "../store/useGroupMakingFilter";
import {
  groupMaking,
  parseKock,
  parsePrice,
  mapPartyType,
} from "../utils/groupMaking";
import { LEVEL_KEY, WEEKLY_KEY } from "../constants/options";
import type { GroupMakingRequestDto } from "../types/groupMaking";

export const useGroupMakingPayload = (): GroupMakingRequestDto => {
  const {
    region,
    femaleLevel,
    maleLevel,
    name,
    weekly,
    type,
    kock,
    money,
    ageRange,
    joinMoney,
    time,
    imgKey,
    content,
  } = useGroupMakingFilterStore();

  return useMemo(() => {
    const [addr1 = "", addr2 = ""] = region ?? [];
    const [minBirthYear = 0, maxBirthYear = 0] = ageRange ?? [];

    return {
      partyName: name ?? "",
      partyType: mapPartyType(type),
      femaleLevel: groupMaking(femaleLevel, LEVEL_KEY),
      maleLevel: groupMaking(maleLevel, LEVEL_KEY),
      addr1,
      addr2,
      activityTime: time ?? "",
      activityDay: groupMaking(weekly, WEEKLY_KEY),
      designatedCock: parseKock(kock),
      joinPrice: parsePrice(joinMoney),
      price: parsePrice(money),
      minBirthYear,
      maxBirthYear,
      content: content?.slice(0, 45) ?? "",
      imgKey: imgKey ?? undefined,
    };
  }, [
    region,
    femaleLevel,
    maleLevel,
    name,
    weekly,
    type,
    kock,
    money,
    ageRange,
    joinMoney,
    time,
    imgKey,
    content,
  ]);
};
