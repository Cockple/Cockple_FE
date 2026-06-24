import api from "../api";

export const getJoinParty = async (partyId: number) => {
  try {
    const { data } = await api.post(`/api/parties/${partyId}/join-requests`);
    return data;
  } catch (err) {
    console.log(err);
  }
};
