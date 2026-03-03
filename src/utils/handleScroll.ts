import { LenisRef } from "lenis/react";

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
  document.documentElement.appendChild(div);
  const width = div.offsetWidth - div.clientWidth;
  document.documentElement.removeChild(div);
  return width || 0;
}

export function lockScroll() {
  const isLocked = document.documentElement.style.position === "fixed";
  if (isLocked) {
    return;
  }
  const scrollY = window.scrollY;
  document.documentElement.style.position = "fixed";
  document.documentElement.style.top = `-${scrollY}px`;
  document.documentElement.style.width = "100%";
  document.documentElement.style.left = "0";
  document.documentElement.dataset.scrollY = `${scrollY}`;

  if (getScrollbarWidth() > 0) {
    const mainScrollbarWidth = getComputedStyle(document.documentElement)
      .getPropertyValue("--scrollbar-main-width")
      .trim();
    document.documentElement.style.paddingRight = mainScrollbarWidth;
  }
}

export function unlockScroll({
  lenisRef,
}: {
  lenisRef: React.RefObject<LenisRef | null>;
}) {
  const scrollY = document.documentElement.dataset.scrollY;

  if (!scrollY) {
    return;
  }

  if (lenisRef.current) {
    lenisRef.current.lenis?.stop();
  }

  document.documentElement.style.position = "";
  document.documentElement.style.top = "";
  document.documentElement.style.width = "";
  document.documentElement.style.left = "";
  document.documentElement.style.right = "";
  document.documentElement.style.paddingRight = "";

  document.documentElement.dataset.scrollY = "";

  requestAnimationFrame(() => {
    document.documentElement.scrollTo(0, parseInt(scrollY));
  });

  setTimeout(() => {
    if (lenisRef.current) {
      lenisRef.current?.lenis?.start();
    }
  }, 500);
}
