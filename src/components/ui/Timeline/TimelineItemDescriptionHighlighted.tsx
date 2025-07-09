import { motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CodeContent, CodeHeader } from "@/components/modals/Code";
import { useGlobalModal } from "@/components/ui/Modal";
import { useProvider } from "@/components/ui/Timeline/Provider";
import { TimelineItemDescriptionHightlightedProps } from "@/components/ui/Timeline/types";

import {
  hexToRgba,
  useClickOutside,
  useCodeFormatter,
  useCodeHighlighter,
  useIsHoverDevice,
} from "@/utils";

export default function TimelineItemDescriptionHighlighted({
  children,
  color,
  id,
}: TimelineItemDescriptionHightlightedProps) {
  const containerRef = useRef<HTMLButtonElement | null>(null);
  const isInView = useInView(containerRef, { once: true });
  const [isHovered, setIsHovered] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const openModalTimeout = useRef<NodeJS.Timeout | null>(null);

  const [code, setCode] = useState("");

  const { highlightedMap } = useProvider();

  const codeHighlighter = useCodeHighlighter();

  if (highlightedMap) {
    useCodeFormatter({
      highlighter: codeHighlighter.current,
      code: highlightedMap[id].template,
      setCode,
      lang: highlightedMap[id].lang,
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
      transition: { duration: 0.5, delay: 2 },
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
      transition: { duration: 0.5, delay: 2 },
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
    if (highlightedMap) {
      if (openModalTimeout.current) {
        clearTimeout(openModalTimeout.current);
      }

      openModalTimeout.current = setTimeout(() => {
        nonModalClosingElements.current = [containerRef.current as Element];
        currentModalId.current = id;
        setHeader(<CodeHeader path={highlightedMap[id].path} />);
        setModal(<CodeContent code={code} />);
        setIsModalShown(true);
      }, 100);
    }
  };

  const handleHoverStart = () => {
    if (useIsHoverDevice()) {
      handleOpenModal();
      setIsHovered(true);
    }
  };

  const handleClick = () => {
    if (useIsHoverDevice()) {
      setIsModalFull(true);
      setIsHovered(true);
    }
  };

  const handlePointerDown = () => {
    if (!useIsHoverDevice()) {
      handleOpenModal();
    }
    setIsClicked(true);
  };

  const handlePointerUp = () => {
    setIsClicked(false);
    setIsHovered(false);
  };

  const handleHoverEnd = () => {
    if (useIsHoverDevice()) {
      if (highlightedMap) {
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
      initial="initial"
      animate={getAnimation}
      onHoverStart={handleHoverStart}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onHoverEnd={handleHoverEnd}
      onPointerCancel={handlePointerUp}
    >
      {children}
    </motion.button>
  );
}
