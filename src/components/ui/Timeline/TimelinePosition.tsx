import { useProvider } from "@/components/ui/Timeline/Provider";
import { TimelineProps } from "@/components/ui/Timeline/types";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export default function Timeline({ items }: TimelineProps) {
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
      const firstItemDot = itemsDotRefs.current[items[0].id];
      const lastItemDot = itemsDotRefs.current[items[items.length - 1].id];
      const lastItemY =
        itemsRefs.current[items[items.length - 1].id]?.getBoundingClientRect()
          .y;

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
                ? Number(itemsHeaderRefs.current[items[0].id]?.offsetHeight) /
                    2 +
                  TIMELINE_DOT_SIZE / 2
                : "auto"
            }px`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION,
            delay:
              TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION +
              TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION,
          }}
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
