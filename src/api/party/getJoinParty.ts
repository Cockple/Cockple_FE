import api from "../api";

export const getJoinParty = async (partyId: number) => {
  try {
    await api.get(`/api/parties/${partyId}/join-requests`);
  } catch (err) {
    console.log(err);
  }
};
