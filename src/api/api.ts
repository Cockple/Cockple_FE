// import axios from "axios";

import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import axios from "axios";

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
function useAxiosInstatnce() {
  const REFRESH_URL = "/api/auth/refresh";
  const navigate = useNavigate();
  const { user, setUser, resetUser } = useUserStore();
  const api = axios.create({
    baseURL: "https://cockple.store",
    timeout: 1000 * 15,
    withCredentials: true,
  });

  // 요청 인터셉터 추가하기
  api.interceptors.request.use(config => {
    if (user && config.url !== REFRESH_URL) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  });

  // 응답 인터셉터 추가하기
  api.interceptors.response.use(
    response => {
      // 2xx 범위에 있는 상태 코드는 이 함수가 호출됨
      // 응답 데이터를 이용해서 필요한 공통 작업 수행

      return response;
    },
    async error => {
      // 2xx 외의 범위에 있는 상태 코드는 이 함수가 호출됨
      // 공통 에러 처리
      console.error("인터셉터", error);
      // return Promise.reject(error);

      const { config, response } = error;

      // 로그인 인증 실패
      if (response?.status === 401) {
        if (config.url === REFRESH_URL) {
          // 리프레시 토큰 만료시
          // alert("로그인이 필요한 페이지입니다.");
          console.error("로그인이 필요합니다.");
          resetUser();
          navigate("/login");
        } else if (user) {
          console.log("리프레시 토큰 요청 시작");
          // accessToken 만료시 refreshToken으로 재발급 요청
          const {
            data: { accessToken },
          } = await api.get(REFRESH_URL, {
            headers: {
              Authorization: `Bearer ${user.refreshToken}`,
            },
          });

          // 갱신된 accessToken 으로 재요청
          setUser({ ...user, accessToken });
          // 새롭게 갱신된 accessToken

          config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(config);
        } else {
          // 로그인이 안 된 경우
          // alert("로그인이 필요한 페이지입니다.");
          console.error("로그인이 필요합니다.");
          navigate("/login");
        }
      }
      return Promise.reject(error);
    },
  );

  return api;
}

export default useAxiosInstatnce;
