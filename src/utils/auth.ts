// src/utils/auth.ts
import useUserStore from "../store/useUserStore";

// base64url → JSON
function parseJwt(token?: string | null) {
  if (!token) return null;
  try {
    const seg = token.split(".")[1] || "";
    const b64 = seg.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// accessToken(스토어→로컬)에서 memberId/nickname을 해석
function resolveFromToken() {
  const st = useUserStore.getState();
  const token = st.user?.accessToken ?? localStorage.getItem("accessToken");
  const jwt = parseJwt(token);
  const memberId = Number(jwt?.memberId ?? jwt?.sub ?? jwt?.id);
  const nickname =
    (jwt?.nickname as string) ??
    (jwt?.name as string) ??
    (jwt?.memberName as string) ??
    null;
  return {
    memberId: Number.isFinite(memberId) && memberId > 0 ? memberId : null,
    nickname: nickname || null,
  };
}

export function resolveMemberId(): number | null {
  const u = useUserStore.getState().user;
  console.log(
    "auth.ts에서 memberId 호출: ",
    u?.memberId,
    resolveFromToken().memberId,
  );
  if (u?.memberId) return u.memberId;
  return resolveFromToken().memberId;
}

export function resolveNickname(): string | null {
  const u = useUserStore.getState().user;
  if (u?.nickname) return u.nickname;
  return resolveFromToken().nickname;
}

// (선택) 앱 초기화 시 스토어/user 비었는데 accessToken만 있을 때 채워넣기
export function bootstrapUserFromStorage() {
  const st = useUserStore.getState();
  if (st.user?.memberId) return;
  const token = st.user?.accessToken ?? localStorage.getItem("accessToken");
  if (!token) return;
  const { memberId, nickname } = resolveFromToken();
  useUserStore.setState({
    user: {
      memberId: memberId ?? 0,
      nickname: nickname ?? "",
      accessToken: token,
      refreshToken: st.user?.refreshToken ?? null,
      isNewMember: st.user?.isNewMember ?? false,
    },
  });
  if (memberId) localStorage.setItem("memberId", String(memberId));
  if (nickname) localStorage.setItem("memberName", nickname);
}
