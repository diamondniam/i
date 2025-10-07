import { useGlobal } from "@/contexts/GlobalContext";
import { WindowEventUtil } from "@/types";
import { useDebouncedCallback } from "@/utils/useDebounce";
import { LenisRef } from "lenis/react";
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

export function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  const div = document.createElement("div");
  div.style.cssText =
    "width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;";
  document.body.appendChild(div);
  const width = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return width || 0;
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

export function unlockScroll({
  lenisRef,
}: {
  lenisRef: React.RefObject<LenisRef | null>;
}) {
  const scrollY = document.body.dataset.scrollY;

  if (!scrollY) {
    return;
  }

  lenisRef.current?.lenis?.stop();

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

  setTimeout(() => {
    lenisRef.current?.lenis?.start();
  }, 500);
}
