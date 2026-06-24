import { useNavigate } from "react-router-dom";
import { ScrollToTop } from "../components/common/ScrollToTop";
import { useEffect } from "react";
import { bootApp } from "@/api/member/onboarding";

interface PrivateRouteProps {
  children?: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    //confirm일때 onboarding체크 skip
    if (location.pathname.startsWith("/confirm")) return;
    bootApp().then(res => {
      if (res.data.needsOnboarding) {
        navigate("/onboarding");
      }
    });
  }, [isAuthenticated, navigate]);
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};
