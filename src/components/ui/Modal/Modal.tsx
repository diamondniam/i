import { ReactNode } from "react";
import ModalProvider from "@/components/ui/Modal/Provider";
import ModalGlobalProvider from "@/components/ui/Modal/ModalGlobalProvider";

export default function Modal({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <ModalGlobalProvider>{children}</ModalGlobalProvider>
    </ModalProvider>
  );
}
