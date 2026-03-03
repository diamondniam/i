"use client";

import {
  getEmptyUseApiGetReturnType,
  useApiGet,
  UseApiGetReturnType,
} from "@/hooks";
import { createContext, useContext } from "react";

type ProviderProps = {
  children: React.ReactNode;
};

type ContextProps = UseApiGetReturnType<any>;

const Context = createContext<ContextProps>(getEmptyUseApiGetReturnType());

export default function ConfigProvider({ children }: ProviderProps) {
  const config = useApiGet<"config", any>({
    table: "config",
    options: {
      cache: {
        key: "config",
      },
    },
  });

  return <Context.Provider value={{ ...config }}>{children}</Context.Provider>;
}

export const useConfig = () => {
  const context = useContext(Context);
  if (!context) throw new Error("Must be used within a Provider");
  return context;
};
