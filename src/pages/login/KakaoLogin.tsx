import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { useMutation } from "@tanstack/react-query";
import api from "../../api/api";

export default function KakaoLogin() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      sendKakaoRequest.mutate({ code });
    }
  }, [location.search]);

  const axios = api;
  const sendKakaoRequest = useMutation({
    mutationFn: ({ code }: { code: string }) => {
      return axios.post("/api/oauth/login", { code });
    },
    onSuccess: data => {
      console.log("성공");
      console.log(data);
      const newUserData = {
        memberId: data.data.mamberId,
        nickname: data.data.nickname,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
      setUser(newUserData);
      if (data.data.isNewMember) {
        //미사용자
        navigate("/onboarding");
      } else {
        //기존 사용자
        navigate("/");
      }
    },
    onError: error => {
      console.log(error);
    },
  });
}
