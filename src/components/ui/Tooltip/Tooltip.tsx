import { useIsHoverDevice } from "@/utils";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
  clickText?: string;
  classNames?: {
    container?: string;
    text?: string;
  };
};

export default function Tooltip({
  children,
  text,
  clickText,
  classNames,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const autoCloseTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseEnter = () => {
    if (useIsHoverDevice()) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (useIsHoverDevice()) {
      setIsOpen(false);
    }
  };

  const handleAutoClose = () => {
    if (autoCloseTimeout.current) {
      clearTimeout(autoCloseTimeout.current);
    }
    autoCloseTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  const handleClick = () => {
    if (!useIsHoverDevice()) {
      setIsOpen(true);
    }

    if (clickText) {
      setIsClicked(true);
    }

    handleAutoClose();
  };

  return (
    <div className="relative">
      <div
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
      </div>

      <AnimatePresence mode="wait" onExitComplete={() => setIsClicked(false)}>
        {isOpen && (
          <motion.span
            className={twMerge(
              "absolute top-[calc(100%+5px)] w-max left-1/2 -translate-x-1/2 z-[5] bg-[var(--background-secondary)] px-2 py-1 rounded-lg text-[var(--text-primary)] text-xs",
              classNames?.text
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {isClicked ? clickText : text}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
