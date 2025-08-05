import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
export default function KakaoLogin() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      sendKakaoRequest(code);
    }
  }, [location.search]);

  const sendKakaoRequest = async (code: string) => {
    try {
      const response = await axios.post(
        `https://cockple.store/api/oauth/login`,
        { code },
        { withCredentials: true },
      );

      const { data } = response;
      console.log(data);
      const newUserData = {
        memberId: data.mamberId,
        nickname: data.nickname,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      setUser(newUserData);
      if (data.isNewMember) {
        //미사용자
        navigate("/onboarding");
      } else {
        //기존 사용자
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
}

// const axios = api;

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const code = params.get("code");

//     if (code) {
//       sendKakao.mutate({ code });
//     }
//   }, [location.search]);

//   const sendKakao = useMutation({
//     mutationFn: ({ code }: { code: string }) => {
//       return axios.post("/api/oauth/login", { code });
//     },
//     onSuccess: data => {
//       console.log("성공");
//       console.log(data);
//     },
//     onError: error => {
//       console.log(error);
//     },
//   });
