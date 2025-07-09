import { createContext, useContext, useRef } from "react";

type ContextProps = {
  laboratoryRef: React.RefObject<HTMLElement | null>;
  laboratoryPhoneRef: React.RefObject<HTMLElement | null>;
};

const Context = createContext<ContextProps | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  const laboratoryRef = useRef<HTMLElement>(null);
  const laboratoryPhoneRef = useRef<HTMLElement>(null);
  const laboratotyPhoneContainerRef = useRef<HTMLElement>(null);

  return (
    <Context.Provider value={{ laboratoryRef, laboratoryPhoneRef }}>
      {children}
    </Context.Provider>
  );
}

export const useFooterPhone = () => {
  const context = useContext(Context);
  if (!context) throw new Error("Must be used within a Provider");
  return context;
};
