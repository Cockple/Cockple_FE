// 웹소켓 연결시 accessToken과 memberId를 안전하고 정확하게 가져오기 위한 파일
import useUserStore from "../store/useUserStore";

export function decodeMemberIdFromToken(token?: string | null): number | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    const v = payload?.memberId ?? payload?.sub ?? payload?.id;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function resolveMemberId(): number | null {
  // 1) store
  const storeUser = useUserStore.getState().user;
  if (storeUser?.memberId) return storeUser.memberId;

  // 2) accessToken의 claim
  const token = storeUser?.accessToken ?? localStorage.getItem("accessToken");
  const fromJwt = decodeMemberIdFromToken(token);
  if (fromJwt) return fromJwt;

  // 3) localStorage에 저장해둔 user/state 혹은 memberId 키
  try {
    const lsUser = localStorage.getItem("user");
    if (lsUser) {
      const parsed = JSON.parse(lsUser);
      const id =
        parsed?.state?.user?.memberId ??
        parsed?.user?.memberId ??
        parsed?.memberId;
      const n = Number(id);
      if (Number.isFinite(n)) return n;
    }
  } catch (err) {
    console.error(err);
  }

  const n = Number(localStorage.getItem("memberId") || NaN);
  return Number.isFinite(n) ? n : null;
}
