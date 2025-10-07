"use client";

import Modal from "@/components/ui/Modal";
import { createContext, useContext, useEffect, useRef } from "react";
import FooterPhone from "./FooterPhone";
import { getScrollbarWidth, useHardware, useResizeObserver } from "@/utils";
import ReactLenis, { LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useMediaQuery } from "react-responsive";

type GlobalProviderProps = {
  children: React.ReactNode;
};

type ContextProps = {
  hardware: {
    power: "low" | "medium" | "high";
    isSet: boolean;
  };
  lenisRef: React.RefObject<LenisRef | null>;
};

const GlobalContext = createContext<ContextProps | null>(null);

gsap.registerPlugin(ScrollTrigger);

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const hardware = useHardware();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const lenisRef = useRef<LenisRef | null>(null);

  const root = useRef<HTMLElement | null>(null);
  const rootLayoutChanges = useResizeObserver<HTMLElement | null>({
    ref: root,
  });

  useEffect(() => {
    root.current = document.documentElement;

    const mainScrollbarWidth = getScrollbarWidth();

    if (mainScrollbarWidth > 0) {
      document.body.classList.add("mainScrollbar");
    }
  }, []);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time);
    }

    const rafId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [rootLayoutChanges.width, rootLayoutChanges.height]);

  return (
    <GlobalContext.Provider value={{ hardware, lenisRef }}>
      {!isMobile && <ReactLenis root ref={lenisRef} />}

      <FooterPhone>
        <Modal>{children}</Modal>
      </FooterPhone>
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("Must be used within a Provider");
  return context;
};
