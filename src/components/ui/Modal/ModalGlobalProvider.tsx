import ReactDOM from "react-dom";
import ModalContentContainer from "@/components/ui/Modal/ModalContentContainer";
import { useModal } from "@/components/ui/Modal/Provider";
import { useContext, createContext } from "react";
import { GlobalModalContextProps } from "@/components/ui/Modal/types ";

const ModalContext = createContext<GlobalModalContextProps | null>(null);

export default function ModalGlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    currentModalId,
    modal,
    setModal,
    header,
    setHeader,
    options,
    setOptions,
    isShown,
    setIsShown,
    isFull,
    setIsFull,
    nonModalClosingElements,
  } = useModal();

  return (
    <ModalContext.Provider
      value={{
        nonModalClosingElements,

        currentModalId,

        modal,
        setModal,
        header,
        setHeader,
        options,
        setOptions,
        isShown,
        setIsShown,
        isFull,
        setIsFull,
      }}
    >
      {children}

      {isShown
        ? ReactDOM.createPortal(<ModalContentContainer />, document.body)
        : null}
    </ModalContext.Provider>
  );
}

export const useGlobalModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Must be used within a Provider");
  return context;
};
