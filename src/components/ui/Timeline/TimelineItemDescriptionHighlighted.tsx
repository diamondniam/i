import { motion, useInView } from "motion/react";
import { useMemo, useRef, useState } from "react";

import { CodeContent, CodeHeader } from "@/components/modals/Code";
import { useGlobalModal } from "@/components/ui/Modal";
import { TimelineItemDescriptionHightlightedProps } from "@/components/ui/Timeline/types";

import {
  useClickOutside,
  useCodeFormatter,
  useCodeHighlighter,
  useOpimizedAnimations,
} from "@/hooks";
import { useGlobal } from "@/contexts";
import { getIsHoverDevice, hexToRgba } from "@/utils";

const ANIMATION_DELAY = 2;

export default function TimelineItemDescriptionHighlighted({
  children,
  color,
  id,
  codes,
}: TimelineItemDescriptionHightlightedProps) {
  const containerRef = useRef<HTMLButtonElement | null>(null);
  const isInView = useInView(containerRef, { once: true });
  const [isHovered, setIsHovered] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const openModalTimeout = useRef<NodeJS.Timeout | null>(null);
  const { hardware } = useGlobal();

  const [code, setCode] = useState("");

  const codeHighlighter = useCodeHighlighter();

  const currentCode = codes.find((code) => code.id === id);

  const optimizeAnimations = useOpimizedAnimations();

  if (codes && currentCode) {
    useCodeFormatter({
      highlighter: codeHighlighter.current,
      code: currentCode.template,
      setCode,
      lang: currentCode.lang,
    });
  }

  const {
    currentModalId,
    setModal,
    setHeader,
    setIsShown: setIsModalShown,
    setIsFull: setIsModalFull,
    nonModalClosingElements,
  } = useGlobalModal();

  const variants = {
    initial: {
      y: 0,
      color: "var(--foreground)",
      background: hexToRgba(color, 0),
      filter: "brightness(1)",
      transition: {
        duration: 0.5,
        delay: hardware.power === "high" ? ANIMATION_DELAY : 0,
      },
    },
    hovered: {
      y: 0,
      color,
      background: hexToRgba(color, 0.2),
      filter: "brightness(1)",
      transition: { duration: 0.2, delay: 0 },
    },
    visible: {
      y: 0,
      color,
      background: hexToRgba(color, 0.1),
      filter: "brightness(1)",
      transition: {
        duration: 0.5,
        delay: hardware.power === "high" ? ANIMATION_DELAY : 0,
      },
    },
    "visible-after": {
      y: 0,
      color,
      background: hexToRgba(color, 0.1),
      filter: "brightness(1)",
      transition: { duration: 0.2, delay: 0 },
    },
    clicked: {
      y: -2,
      color,
      background: hexToRgba(color, 0.1),
      filter: "brightness(0.5)",
      transition: { duration: 0.2, delay: 0 },
    },
  };

  useClickOutside<HTMLButtonElement | null>(containerRef, () =>
    setIsHovered(false)
  );

  const handleOpenModal = () => {
    if (currentCode) {
      if (openModalTimeout.current) {
        clearTimeout(openModalTimeout.current);
      }

      openModalTimeout.current = setTimeout(() => {
        nonModalClosingElements.current = [containerRef.current as Element];
        currentModalId.current = id;
        setHeader(<CodeHeader path={currentCode.path} />);
        setModal(<CodeContent code={code} />);
        setIsModalShown(true);
      }, 100);
    }
  };

  const handleHoverStart = () => {
    if (getIsHoverDevice()) {
      handleOpenModal();
      setIsHovered(true);
    }
  };

  const handleClick = () => {
    if (getIsHoverDevice()) {
      setIsModalFull(true);
      setIsHovered(true);
    }

    if (!getIsHoverDevice()) {
      handleOpenModal();
    }
  };

  const handlePointerDown = () => {
    setIsClicked(true);
  };

  const handlePointerUp = () => {
    setIsClicked(false);
    setIsHovered(false);
  };

  const handleHoverEnd = () => {
    if (getIsHoverDevice()) {
      if (currentCode) {
        if (openModalTimeout.current) {
          clearTimeout(openModalTimeout.current);
        }
      }

      setIsHovered(false);
    }
  };

  const getAnimation = useMemo<string>(() => {
    if (isClicked) {
      setIsShown(true);
      return "clicked";
    } else if (isHovered && isInView) {
      setIsShown(true);
      return "hovered";
    } else {
      if (isShown) {
        return "visible-after";
      } else return "visible";
    }
  }, [isHovered, isInView, isShown, isClicked]);

  return (
    <motion.button
      ref={containerRef}
      className={`rounded-sm px-0.5`}
      variants={variants}
      {...optimizeAnimations({
        animations: {
          initial: "initial",
        },
      })}
      animate={getAnimation}
      onHoverStart={handleHoverStart}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onHoverEnd={handleHoverEnd}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {children}
    </motion.button>
  );
}
