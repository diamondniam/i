"use client";

import { ModalContextProps, Options } from "@/components/ui/Modal/types ";
import {
  lockScroll,
  unlockScroll,
  useClickOutside,
  useResize,
  useScrollPosition,
} from "@/utils";
import { animate, useMotionValue } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const ModalContext = createContext<ModalContextProps | null>(null);

const DRAG_THRESHOLD = 100;
const HOVER_Y_ANIMATION_VALUE = 3;
const MODAL_INITIAL_HEIGHT_IN_PERCENT = 0.2;
const MODAL_FULL_HEIGHT_IN_PERCENT = 0.9;
const HIDDEN_MODAL_Y = 200;
const MODAL_USUAL_ANIMATION_DURATION = 0.5;

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentModalId = useRef<string | null>(null);
  const lastModalId = useRef<string | null>(null);

  const [currentModalContent, setCurrentModalContent] = useState<{
    header: React.ReactNode;
    modal: React.ReactNode;
  } | null>(null);

  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const [header, setHeader] = useState<React.ReactNode | null>(null);
  const [options, setOptions] = useState<Options | null>(null);

  const nonModalClosingElements = useRef<Element[]>([]);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const [isShown, setIsShown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [fullYValue, setFullYValue] = useState(0);
  const [initialYValue, setInitialYValue] = useState(0);
  const [isDragButtonHovered, setIsDragButtonHovered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isModalContentTransitioningBetween = useRef(false);

  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const windowSize = useResize({ debounceDelay: 100 });

  const containerY = useMotionValue(HIDDEN_MODAL_Y);
  const dragButtonScale = useMotionValue(1);

  useClickOutside(modalContentRef, (e) => {
    const isClickOutside = nonModalClosingElements.current.every(
      (el) => !el.contains(e.target as Node)
    );

    if (!isFull && isClickOutside) {
      handleModalClose();
    }
  });

  const scrollPosition = useScrollPosition({
    debounceDelay: 100,
  });

  const animateContainerY = (y: number) => {
    setIsAnimating(true);

    animate(containerY, y, {
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  };

  const handleFullMode = () => {
    setIsFull(true);
    lockScroll();

    const navigation = document.querySelector("nav");

    if (navigation) {
      animate(navigation, { opacity: 0 }, { duration: 0.5 });
    }

    setTimeout(() => {
      animateContainerY(fullYValue);
    });
  };

  const handleFullModeClose = () => {
    if (isFull) {
      setIsFull(false);
      animateContainerY(0);
      unlockScroll();
    } else {
      setIsFull(false);
      handleModalClose();
    }
  };

  const orderOpenModal = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    if (openTimeout.current) {
      clearTimeout(openTimeout.current);
    }

    openTimeout.current = setTimeout(() => {
      setIsShown(true);
      setIsFull(false);
      setIsClosing(false);
      animateContainerY(0);
      setCurrentModalContent({
        header,
        modal,
      });
    }, MODAL_USUAL_ANIMATION_DURATION * 1000);
  };

  const modalChangeTransition = () => {
    isModalContentTransitioningBetween.current = true;

    animateContainerY(initialYValue);

    if (openTimeout.current) {
      clearTimeout(openTimeout.current);
    }

    openTimeout.current = setTimeout(() => {
      setCurrentModalContent({
        header,
        modal,
      });
      animateContainerY(0);
      isModalContentTransitioningBetween.current = false;
    }, MODAL_USUAL_ANIMATION_DURATION * 1000);
  };

  const handleModalClose = () => {
    animateContainerY(initialYValue);
    setIsFull(false);
    setIsClosing(true);

    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }

    closeTimeout.current = setTimeout(() => {
      setOptions(null);
      setIsClosing(false);
      setIsShown(false);
      unlockScroll();
      nonModalClosingElements.current = [];

      const navigation = document.querySelector("nav");

      if (navigation) {
        animate(navigation, { opacity: 1 }, { duration: 0.5 });
      }
    }, MODAL_USUAL_ANIMATION_DURATION * 1000);
  };

  useEffect(() => {
    if (isFull) {
      handleFullMode();
    }
  }, [isFull]);

  useEffect(() => {
    if (
      isClosing &&
      isShown &&
      currentModalId.current &&
      lastModalId.current &&
      currentModalId.current !== lastModalId.current &&
      options?.mode !== "full"
    ) {
      orderOpenModal();
    }
  }, [currentModalId.current, isShown, isClosing]);

  useEffect(() => {
    if (
      isShown &&
      currentModalId.current &&
      lastModalId.current &&
      currentModalId.current !== lastModalId.current &&
      options?.mode !== "full" &&
      !isClosing &&
      !isModalContentTransitioningBetween.current
    ) {
      modalChangeTransition();
    }

    lastModalId.current = currentModalId.current;
  }, [currentModalId.current]);

  useEffect(() => {
    if (!isClosing) {
      if (isShown) {
        if (!currentModalId.current) throw new Error("Modal id is not set");

        setCurrentModalContent({
          header,
          modal,
        });

        if (options?.mode === "full") {
          setIsFull(true);
          handleFullMode();
        } else {
          setIsFull(false);
          animateContainerY(0);
        }
      }
    }
  }, [isShown]);

  useEffect(() => {
    if (!isFull && !isAnimating && !isDragging && isShown) {
      handleModalClose();
    }
  }, [scrollPosition]);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const fullModePercent = 0.5;
    const fullModeTarget = -windowHeight * fullModePercent;
    setFullYValue(fullModeTarget);

    const initialPercent = MODAL_INITIAL_HEIGHT_IN_PERCENT;
    const initialTarget = windowHeight * initialPercent;
    setInitialYValue(initialTarget);
  }, [windowSize]);

  return (
    <ModalContext.Provider
      value={{
        currentModalId,

        modalContentRef,
        nonModalClosingElements,

        modal,
        header,
        options,
        currentModalContent,

        isShown,
        isAnimating,
        isDragging,
        isFull,
        fullYValue,
        containerY,
        dragButtonScale,
        isDragButtonHovered,

        HIDDEN_MODAL_Y,
        MODAL_USUAL_ANIMATION_DURATION,
        DRAG_THRESHOLD,
        HOVER_Y_ANIMATION_VALUE,
        MODAL_INITIAL_HEIGHT_IN_PERCENT,
        MODAL_FULL_HEIGHT_IN_PERCENT,

        setModal,
        setHeader,
        setOptions,

        setIsShown,
        setIsAnimating,
        setIsDragging,
        setIsFull,
        setFullYValue,
        setIsDragButtonHovered,
        animateContainerY,
        handleFullMode,

        handleFullModeClose,
        handleModalClose,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Must be used within a Provider");
  return context;
};
