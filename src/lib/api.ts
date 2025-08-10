// import axios from "axios";
// //아직 확정이 나면 그때 src/api 삭제하고 이걸로...ㅎㅎ
// const api = axios.create({
//   baseURL: "https://cockple.store",
// });
// // export default api;

// // 요청 시 Authorization 헤더 자동 삽입
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;