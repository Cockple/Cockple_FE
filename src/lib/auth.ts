//토큰 발급 유틸 함수 
import axios from "axios";

export async function fetchDevToken() {
  try {
    const res = await axios.post("https://cockple.store/api/auth/dev-token");
    if (res.data.success) {
      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return accessToken;
    } else {
      console.error("토큰 발급 실패:", res.data.message);
    }
  } catch (err) {
    console.error("토큰 요청 실패:", err);
  }
}
