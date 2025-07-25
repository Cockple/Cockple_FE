import { useEffect, useState } from "react";

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export const useIsStandalone = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isMatchMedia =
        window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;

      const navigator = window.navigator as NavigatorStandalone;
      const isIOSStandalone = navigator.standalone === true;

      return isMatchMedia || isIOSStandalone;
    };

    setIsStandalone(checkStandalone());

    const mediaQuery = window.matchMedia?.("(display-mode: standalone)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };

    mediaQuery?.addEventListener?.("change", handleChange);
    return () => mediaQuery?.removeEventListener?.("change", handleChange);
  }, []);

  return isStandalone;
};
