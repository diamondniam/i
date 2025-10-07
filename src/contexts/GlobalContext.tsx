"use client";

import Modal from "@/components/ui/Modal";
import { createContext, useContext, useEffect, useRef } from "react";
import FooterPhone from "./FooterPhone";
import { getScrollbarWidth, useHardware, useResizeObserver } from "@/utils";
import ReactLenis from "lenis/react";
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
};

const GlobalContext = createContext<ContextProps | null>(null);

gsap.registerPlugin(ScrollTrigger);

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const hardware = useHardware();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
    ScrollTrigger.refresh();
  }, [rootLayoutChanges.width, rootLayoutChanges.height]);

  return (
    <GlobalContext.Provider value={{ hardware }}>
      {!isMobile && <ReactLenis root />}

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
