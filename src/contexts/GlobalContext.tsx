"use client";

import Modal from "@/components/ui/Modal";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import FooterPhone from "./FooterPhone";
import { useHardware, useResizeObserver } from "@/hooks";
import ReactLenis, { LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { createClient, getScrollbarWidth } from "@/utils";
import { SupabaseClient } from "@supabase/supabase-js";
import ConfigProvider from "@/contexts/ConfigContext";

type GlobalProviderProps = {
  children: React.ReactNode;
};

type ContextProps = {
  hardware: {
    power: "low" | "medium" | "high";
    isSet: boolean;
  };
  clientApi: SupabaseClient | null;
  lenisRef: React.RefObject<LenisRef | null>;
};

const GlobalContext = createContext<ContextProps | null>(null);

gsap.registerPlugin(ScrollTrigger);

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const hardware = useHardware();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const lenisRef = useRef<LenisRef | null>(null);
  const [clientApi, setClientApi] = useState<SupabaseClient | null>(null);

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

    const createSupabaseClient = async () => {
      const supabase = await createClient();

      setClientApi(supabase);
    };

    createSupabaseClient();
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
    <GlobalContext.Provider value={{ clientApi, hardware, lenisRef }}>
      {!isMobile && <ReactLenis root ref={lenisRef} />}

      <ConfigProvider>
        <FooterPhone>
          <Modal>{children}</Modal>
        </FooterPhone>
      </ConfigProvider>
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("Must be used within a Provider");
  return context;
};
