"use client";

import Modal from "@/components/ui/Modal";
import { createContext, useContext } from "react";
import FooterPhone from "./FooterPhone";
import { useHardware } from "@/utils";

type GlobalProviderProps = {
  children: React.ReactNode;
};

type ContectProps = {
  hardware: {
    power: "low" | "medium" | "high";
    concurrency: number | undefined;
  };
};

const GlobalContext = createContext<ContectProps | null>(null);

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const hardware = useHardware();

  return (
    <GlobalContext.Provider value={{ hardware }}>
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
