import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { SuggestParms } from "../../types/groupMaking";
import { useParams } from "react-router-dom";

export const useMemberInfinite = ({
  levelSearch,
  page = 0,
  size = 10,
  sort,
}: SuggestParms) => {
  const axios = api;

  const paramsId = useParams();
  const partyId = Number(paramsId.partyId);
  return useQuery({
    queryKey: ["memberSuggestions", levelSearch, page, size, partyId],
    enabled: !!partyId,
    queryFn: async () => {
      const params: SuggestParms = {
        levelSearch,
        page,
        size,
        ...(sort ? { sort: Array.isArray(sort) ? sort : [sort] } : {}),
      };

      const res = await axios.get(
        `/api/parties/${partyId}/members/suggestions`,
        {
          params,
        },
      );
      return res.data.data;
    },
  });
};
