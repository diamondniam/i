import { WindowEventUtil } from "@/types";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export function useScrollPosition(
  {
    debounceDelay,
    initial,
    handler,
    options,
  }: WindowEventUtil & { handler?: () => void } = {
    initial: false,
  }
) {
  debounceDelay = debounceDelay && debounceDelay > 0 ? debounceDelay : 0;

  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
    if (handler) {
      handler();
    }
  };

  const handleScrollDebounced = useDebouncedCallback({
    callback: handleScroll,
    delay: debounceDelay,
    options,
  });

  useEffect(() => {
    if (debounceDelay > 0) {
      document.addEventListener("scroll", handleScrollDebounced);
    } else {
      document.addEventListener("scroll", handleScroll);
    }

    if (initial) {
      handleScroll();
    }

    return () => {
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScrollDebounced);
    };
  }, []);

  return scrollPosition;
}
