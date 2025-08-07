import axios from "axios";

const raw = JSON.parse(sessionStorage.getItem("user"));
const accessToken = raw.state.user.accessToken;
console.log(accessToken);
const api = axios.create({
  baseURL: "https://cockple.store",
  headers: {
    Authorization: `Bearer ${accessToken}`, // ✅ 이게 있어야 함
  },
});

export default api;
