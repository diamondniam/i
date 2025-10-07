import { useProvider } from "@/components/ui/Timeline/Provider";
import { useGlobal } from "@/contexts/GlobalContext";
import { useOpimizedAnimations } from "@/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import "./style.css";

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
  const { hardware } = useGlobal();

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
        const lastItemDotFixedY =
          lastItemDot.getBoundingClientRect().y - containerY;
        const firstItemDotFixedY =
          firstItemDot.getBoundingClientRect().y - containerY;

        return lastItemDotFixedY - firstItemDotFixedY;
      }
    } else {
      return 0;
    }
  }, [isSet, containerHeight, containerWidth]);

  useEffect(() => {
    if (isActiveLineVisible) {
      setActivePostionLineHeight(TIMELINE_ACTIVE_LINE_HEIGHT);
    }
  }, [isActiveLineVisible]);

  if (isSet) {
    return (
      <AnimatePresence mode="wait">
        {isSet && (
          <motion.div
            ref={lineRef}
            className="h-full w-[1px] bg-[var(--timeline-base-color)] absolute overflow-hidden"
            style={{
              height: `${getLineHeight}px`,
              top: `${
                Number(itemsHeaderRefs.current[0]?.offsetHeight) / 2 +
                TIMELINE_DOT_SIZE / 2
              }px`,
            }}
            {...useOpimizedAnimations({
              hardware,
              animations: {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: {
                  duration: TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION,
                  delay:
                    TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION +
                    TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION,
                },
              },
            })}
          >
            <motion.div
              className={`w-[1px] absolute activeLineBg`}
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
}
