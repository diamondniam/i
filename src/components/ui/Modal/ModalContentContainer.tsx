import ModalContent from "@/components/ui/Modal/ModalContent";
import { useModal } from "@/components/ui/Modal/Provider";
import {
  motion,
  AnimatePresence,
  animate,
  PanInfo,
  useDragControls,
} from "motion/react";
import { twMerge } from "tailwind-merge";

export default function ModalContentContainer() {
  const {
    options,

    modalContentRef,

    isAnimating,
    containerY,
    isDragging,
    actualIsFull,
    fullYValue,
    dragButtonScale,
    isDragButtonHovered,

    MODAL_USUAL_ANIMATION_DURATION,
    MODAL_INITIAL_HEIGHT_IN_PERCENT,
    DRAG_THRESHOLD,
    HOVER_Y_ANIMATION_VALUE,
    MODAL_FULL_HEIGHT_IN_PERCENT,
    HIDDEN_MODAL_Y,

    setIsFull,
    setActualIsFull,
    setIsAnimating,
    setIsDragging,
    setIsDragButtonHovered,

    animateContainerY,
    handleFullMode,
    handleFullModeClose,
    handleModalClose,
  } = useModal();

  const dragControls = useDragControls();

  const handleContainerDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    animate(dragButtonScale, 1);

    if (info.offset.y < -DRAG_THRESHOLD) {
      setIsFull(true);
    } else if (info.offset.y > DRAG_THRESHOLD) {
      handleFullModeClose();
    }

    setIsDragging(false);
  };

  const handleContainerDragStart = () => {
    setIsDragging(true);
  };

  const handleButtonPointerEnter = () => {
    animate(dragButtonScale, 1.2);
    setIsDragButtonHovered(true);

    if (!isAnimating && !isDragging) {
      animate(
        containerY,
        actualIsFull
          ? fullYValue + HOVER_Y_ANIMATION_VALUE
          : 0 - HOVER_Y_ANIMATION_VALUE
      );
    }
  };

  const handleContainerPointerDown = () => {
    setIsDragging(true);
  };

  const handleButtonPointerLeave = () => {
    animate(dragButtonScale, 1);
    setIsDragButtonHovered(false);

    if (!isAnimating && !isDragging) {
      animate(containerY, actualIsFull ? fullYValue : 0);
    }
  };

  return (
    <div className="fixed z-50">
      <AnimatePresence mode="wait">
        {actualIsFull ? (
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 bg-[var(--backdrop-color)]"
            onClick={handleModalClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MODAL_USUAL_ANIMATION_DURATION }}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        ref={modalContentRef}
        className={twMerge(
          `w-[70%] max-md:w-[80%] max-w-[calc(var(--max-width)_-_200px)] max-sm:w-[90%] fixed left-1/2 bg-[var(--background-third)] flex flex-col gap-3 translate-x-[-50%] max-h-[${MODAL_INITIAL_HEIGHT_IN_PERCENT * 100}%] min-h-[${MODAL_INITIAL_HEIGHT_IN_PERCENT * 100}%] overflow-hidden shadow-md`
        )}
        initial={{
          bottom: options?.mode === "full" ? undefined : 0,
          y: options?.mode === "full" ? undefined : HIDDEN_MODAL_Y,
        }}
        style={{
          y: containerY,
          padding: "15px",
          borderRadius: "15px",
          bottom: options?.mode === "full" ? "-50%" : "0%",
        }}
        animate={{
          bottom: actualIsFull ? "-50%" : "0%",
          paddingBottom: actualIsFull ? "15px" : "0px",
          borderBottomRightRadius:
            isDragging || (isDragButtonHovered && !actualIsFull)
              ? "15px"
              : "0px",
          borderBottomLeftRadius:
            isDragging || (isDragButtonHovered && !actualIsFull)
              ? "15px"
              : "0px",
          minHeight: actualIsFull
            ? `${MODAL_FULL_HEIGHT_IN_PERCENT * 100}%`
            : `${MODAL_INITIAL_HEIGHT_IN_PERCENT * 100}%`,
        }}
        drag="y"
        dragConstraints={{
          top: containerY.get(),
          bottom: actualIsFull ? fullYValue : 0,
        }}
        dragListener={false}
        dragControls={dragControls}
        onDragStart={() => handleContainerDragStart()}
        onDragEnd={(e, info) => handleContainerDragEnd(e, info)}
        onPointerDown={() => handleContainerPointerDown()}
        transition={{ duration: MODAL_USUAL_ANIMATION_DURATION }}
      >
        <motion.button
          className="sticky top-0 flex items-center justify-center py-2 rounded-lg w-full !cursor-grab touch-none"
          onPointerDown={(e) => dragControls.start(e)}
          style={{
            scale: dragButtonScale,
          }}
          onPointerEnter={() => handleButtonPointerEnter()}
          onPointerLeave={() => handleButtonPointerLeave()}
          transition={{ duration: MODAL_USUAL_ANIMATION_DURATION }}
        >
          <div className="h-1 bg-[var(--foreground)]/70 rounded-lg w-[60px] mx-auto"></div>
        </motion.button>

        <ModalContent />
      </motion.div>
    </div>
  );
}
