"use client";

import Modal from "@/components/ui/Modal";
import { createContext, useContext } from "react";
import FooterPhone from "./FooterPhone";

type GlobalProviderProps = {
  children: React.ReactNode;
};

const GlobalContext = createContext<any>(null);

export default function GlobalProvider({ children }: GlobalProviderProps) {
  return (
    <GlobalContext.Provider value={{}}>
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
