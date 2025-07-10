import { useEffect, useState } from "react";

export function useActivePage(): boolean {
  const [isActive, setIsActive] = useState<boolean>(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };

    const handleFocus = () => setIsActive(true);
    const handleBlur = () => setIsActive(false);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return isActive;
}
