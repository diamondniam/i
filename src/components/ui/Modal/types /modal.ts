import { MotionValue } from "motion/react";

export type ModalContextProps = {
  currentModalId: React.RefObject<string | null>;
  nonModalClosingElements: React.RefObject<Element[]>;

  modalContentRef: React.RefObject<HTMLDivElement | null>;

  modal: React.ReactNode | null;
  header: React.ReactNode | null;
  options: Options | null;
  currentModalContent: {
    header: React.ReactNode;
    modal: React.ReactNode;
  } | null;

  isShown: boolean;
  isAnimating: boolean;
  isDragging: boolean;
  isFull: boolean;
  fullYValue: number;
  containerY: MotionValue<number>;
  dragButtonScale: MotionValue<number>;
  isDragButtonHovered: boolean;

  HIDDEN_MODAL_Y: number;
  MODAL_USUAL_ANIMATION_DURATION: number;
  DRAG_THRESHOLD: number;
  HOVER_Y_ANIMATION_VALUE: number;
  MODAL_INITIAL_HEIGHT_IN_PERCENT: number;
  MODAL_FULL_HEIGHT_IN_PERCENT: number;

  setModal: (modal: React.ReactNode | null) => void;
  setHeader: (header: React.ReactNode | null) => void;
  setOptions: (options: Options) => void;

  setIsShown: (isShown: boolean) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  setIsDragging: (isDragging: boolean) => void;
  setIsFull: (isFull: boolean) => void;
  setFullYValue: (y: number) => void;
  animateContainerY: (y: number) => void;
  setIsDragButtonHovered: (isHovered: boolean) => void;

  handleFullMode: () => void;
  handleFullModeClose: () => void;
  handleModalClose: () => void;
};

export type Options = {
  mode?: "full" | undefined;
};
