import { useModal } from "@/components/ui/Modal/Provider";
import { AnimatePresence, motion } from "motion/react";

export default function ModalContent() {
  const { currentModalContent, actualIsFull, MODAL_USUAL_ANIMATION_DURATION } =
    useModal();

  return (
    <div className="flex flex-col gapS w-full h-full overflow-auto">
      {currentModalContent?.header ? (
        <div>{currentModalContent?.header}</div>
      ) : null}

      <motion.div
        className="max-h-[20%] w-full h-full smallScrollbar relative"
        animate={{
          overflowY: actualIsFull ? "auto" : "hidden",
        }}
      >
        {currentModalContent?.modal}

        <AnimatePresence initial={false}>
          {!actualIsFull ? (
            <motion.div
              className="gradientBackgroundThirdToTransparentTop bottom-0 left-0 h-full w-full fixed pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: MODAL_USUAL_ANIMATION_DURATION,
              }}
            ></motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
