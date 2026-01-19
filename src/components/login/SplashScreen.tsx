import SplashIcon from "@/assets/images/Logo_Typo.png?url";
import useSplashStore from "@/store/useSplashStore";
import { useEffect } from "react";

export default function SplashScreen() {
  const { isSplashShown, showSplash } = useSplashStore();

  useEffect(() => {
    if (!isSplashShown) {
      showSplash();
    }
  }, [isSplashShown, showSplash]);

  return (
    <div
      className=" w-full flex items-center justify-center bg-white animate-fade-out -mb-8"
      style={{ height: "100dvh" }}
    >
      <img src={SplashIcon} className="px-6" alt="splash screen"></img>
    </div>
  );
}
