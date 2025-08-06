import axios from "axios";

const api = axios.create({
  baseURL: "https://cockple.store",
});

const TEMP_TOKEN = import.meta.env.VITE_APP_DEV_TOKEN;

api.interceptors.request.use(
  config => {
    // 3. config.headers에 Authorization 헤더를 추가합니다.
    if (TEMP_TOKEN) {
      config.headers.Authorization = `Bearer ${TEMP_TOKEN}`;
    }

    // 4. 수정된 config를 반환해야 요청이 정상적으로 진행됩니다.
    return config;
  },
  error => {
    // 요청 오류가 있는 경우 처리
    return Promise.reject(error);
  },
);

export default api;
