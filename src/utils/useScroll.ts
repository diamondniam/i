import { WindowEventUtil } from "@/types";
import { useDebouncedCallback } from "@/utils/useDebounce";
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
      window.addEventListener("scroll", handleScrollDebounced);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    if (initial) {
      handleScroll();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollDebounced);
    };
  }, []);

  return scrollPosition;
}

export function handleIsScrollingFn(
  isScrolling: React.RefObject<boolean>,
  timeoutRef: React.RefObject<ReturnType<typeof setTimeout> | null>,
  delay?: number
) {
  return () => {
    isScrolling.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      isScrolling.current = false;
    }, delay || 100);
  };
}

function getScrollbarWidth() {
  const scrollDiv = document.createElement("div");
  scrollDiv.style.width = "100px";
  scrollDiv.style.height = "100px";
  scrollDiv.style.overflow = "scroll";
  scrollDiv.style.position = "absolute";
  scrollDiv.style.top = "-9999px";
  document.body.appendChild(scrollDiv);

  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}

export function lockScroll() {
  const isLocked = document.body.style.position === "fixed";
  if (isLocked) {
    return;
  }
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.style.left = "0";
  document.body.dataset.scrollY = `${scrollY}`;
  if (getScrollbarWidth() > 0) {
    const mainScrollbarWidth = getComputedStyle(document.documentElement)
      .getPropertyValue("--scrollbar-main-width")
      .trim();
    document.body.style.paddingRight = mainScrollbarWidth;
  }
}

export function unlockScroll() {
  const scrollY = document.body.dataset.scrollY;

  if (!scrollY) {
    return;
  }
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.paddingRight = "";

  document.body.dataset.scrollY = "";
  window.scrollTo({
    top: parseInt(scrollY),
    behavior: "instant",
  });
}
