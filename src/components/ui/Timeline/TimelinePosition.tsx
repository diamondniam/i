import { useProvider } from "@/components/ui/Timeline/Provider";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export default function Timeline() {
  const {
    containerRef,
    lineRef,
    itemsRefs,
    itemsHeaderRefs,
    itemsDotRefs,

    TIMELINE_DOT_SIZE,
    TIMELINE_ACTIVE_LINE_HEIGHT,

    TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION,
    TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION,
    TIMELINE_ACTIVE_POSITION_INITIAL_OPACITY_ANIMATION_DURATION,

    timelineActiveLineTop,
    isActiveLineVisible,
    isSet,

    containerHeight,
    containerWidth,
  } = useProvider();

  const [activePostionLineHeight, setActivePostionLineHeight] = useState(0);

  const getLineHeight = useMemo(() => {
    if (isSet && containerRef.current) {
      const containerY = containerRef.current.getBoundingClientRect().y;
      const firstItemDot = itemsDotRefs.current[0];
      const lastItemDot = itemsDotRefs.current[itemsDotRefs.current.length - 1];
      const lastItemY =
        itemsRefs.current[
          itemsDotRefs.current.length - 1
        ]?.getBoundingClientRect().y;

      if (lastItemY && firstItemDot && lastItemDot) {
        return (
          lastItemY -
          containerY +
          lastItemDot.offsetTop -
          firstItemDot.offsetTop -
          TIMELINE_DOT_SIZE
        );
      }
    }

    return 0;
  }, [isSet, containerHeight, containerWidth]);

  useEffect(() => {
    if (isActiveLineVisible) {
      setActivePostionLineHeight(TIMELINE_ACTIVE_LINE_HEIGHT);
    }
  }, [isActiveLineVisible]);

  return (
    <AnimatePresence mode="wait">
      {isSet && (
        <motion.div
          ref={lineRef}
          className="h-full w-[1px] bg-[var(--gray)]/20 absolute overflow-hidden"
          style={{
            height: `${getLineHeight}px`,
            top: `${
              isSet
                ? Number(itemsHeaderRefs.current[0]?.offsetHeight) / 2 +
                  TIMELINE_DOT_SIZE / 2
                : "auto"
            }px`,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION,
            delay:
              TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION +
              TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION,
          }}
          viewport={{ once: true }}
        >
          <motion.div
            className={`w-[1px] absolute bg-gradient-to-t from-transparent via-[var(--foreground)] to-transparent`}
            style={{
              height: `${activePostionLineHeight}px`,
              top: `${timelineActiveLineTop}px`,
              transition: "height 0.5s",
            }}
            animate={{ opacity: isActiveLineVisible ? 1 : 0 }}
            transition={{
              duration:
                TIMELINE_ACTIVE_POSITION_INITIAL_OPACITY_ANIMATION_DURATION,
            }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
