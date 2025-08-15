// import axios from "axios";
// const api = axios.create({
//   baseURL: "https://cockple.store",
// });

// const TEMP_TOKEN = import.meta.env.VITE_APP_DEV_TOKEN;

// api.interceptors.request.use(
//   config => {
//     if (TEMP_TOKEN) {
//       config.headers.Authorization = `Bearer ${TEMP_TOKEN}`;
//     }

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

// export default api;

//--------------------------리프레쉬 반영--------------------------
import axios, { type InternalAxiosRequestConfig } from "axios";
import useUserStore from "../store/useUserStore";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true, // 쿠키 포함
});

const isRefreshUrl = (url?: string) =>
  typeof url === "string" && url.includes("/api/auth/refresh");

function getAccessToken(): string | null {
  const { user } = useUserStore.getState();
  return user?.accessToken ?? localStorage.getItem("accessToken");
}

function setTokens(accessToken: string, refreshToken?: string | null) {
  const { user } = useUserStore.getState();
  useUserStore.setState({
    user: user
      ? {
          ...user,
          accessToken,
          refreshToken: refreshToken ?? user.refreshToken ?? null,
        }
      : {
          memberId: 0,
          nickname: "",
          accessToken,
          refreshToken: refreshToken ?? null,
          isNewMember: false,
        },
  });
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken !== undefined) {
    if (refreshToken === null) localStorage.removeItem("refreshToken");
    else localStorage.setItem("refreshToken", refreshToken);
  }
}

function clearTokensAndRedirect() {
  useUserStore.getState().resetUser?.();
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}

// 요청 인터셉터: refresh 호출은 제외하고 Authorization 주입
api.interceptors.request.use(
  config => {
    if (!isRefreshUrl(config.url)) {
      const token = getAccessToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

// 응답 인터셉터
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    // 응답 자체가 없으면(네트워크 장애 등) 그대로 반환
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const isRefresh = isRefreshUrl(originalRequest?.url);

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      // refresh 호출이 401이면 세션 정리
      if (isRefresh) {
        clearTokensAndRedirect();
        return Promise.reject(error);
      }

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            // 쿠키 기반, Authorization 제거
            const { data } = await api.post("/api/auth/refresh", undefined, {
              withCredentials: true,
              headers: { Authorization: "" },
            });

            const newAccessToken: string = data?.accessToken;
            const newRefreshToken: string | undefined = data?.refreshToken;

            if (!newAccessToken)
              throw new Error("No access token in refresh response");

            setTokens(newAccessToken, newRefreshToken ?? undefined);
            return newAccessToken;
          } catch (err) {
            clearTokensAndRedirect();
            throw err;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const newAccessToken = await refreshPromise;

      // 타입 안전하게 Authorization 헤더 주입
      if (originalRequest.headers?.set) {
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );
      } else {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return api.request(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default api;
