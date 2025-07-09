import { Options } from "@/components/ui/Modal/types /modal";

export type GlobalModalContextProps = {
  nonModalClosingElements: React.RefObject<Element[]>;

  currentModalId: React.RefObject<string | null>;

  modal: React.ReactNode | null;
  setModal: (modal: React.ReactNode | null) => void;
  header: React.ReactNode | null;
  setHeader: (header: React.ReactNode | null) => void;
  options: Options | null;
  setOptions: (options: Options) => void;
  isShown: boolean;
  setIsShown: (isShown: boolean) => void;
  isFull: boolean;
  setIsFull: (isFull: boolean) => void;
};
