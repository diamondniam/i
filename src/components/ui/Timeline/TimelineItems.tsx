import { useProvider } from "@/components/ui/Timeline/Provider";
import TimelineItem from "@/components/ui/Timeline/TimelineItem";
import { TimelineItem as TimelineItemType } from "@/components/ui/Timeline/types";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function TimelineItems({
  items,
}: {
  items: TimelineItemType[];
}) {
  const {
    containerRef,
    itemsDotRefs,
    lineRef,
    itemsHeaderRefs,

    TIMELINE_DOT_SIZE,
    TIMELINE_ACTIVE_LINE_HEIGHT,
    TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT,

    TIMELINE_INITIAL_TRANSFORM_ANIMATION_DURATION,
    TIMELINE_INITIAL_TRANSFORM_ANIMATION_DELAY_DURATION,
    CONTENT_INITIAL_OPACITY_ANIMATION_DURATION,
    TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION,
    TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION,

    isSet,
    timelineActiveLineTop,
  } = useProvider();

  const [dotStyles, setDotStyles] = useState<
    Record<string, React.CSSProperties>
  >({});
  const [dotAnimationDelays, setDotAnimationDelays] = useState<
    Record<string, number>
  >({
    transform: TIMELINE_INITIAL_TRANSFORM_ANIMATION_DELAY_DURATION,
    opacity:
      TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION +
      TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION,
  });

  useEffect(() => {
    if (isSet) {
      const newDotStyles: Record<string, React.CSSProperties> = {};
      items.forEach((item) => {
        newDotStyles[item.id] = getIsInActiveLineRange(item.id);
      });
      setDotStyles(newDotStyles);
    }
  }, [isSet, timelineActiveLineTop, items]);

  const getIsInActiveLineRange = (id: string) => {
    const firstItemTimelineDot = itemsDotRefs.current[items[0].id];

    if (itemsDotRefs.current[id] && lineRef.current && firstItemTimelineDot) {
      const containerTop = firstItemTimelineDot.getBoundingClientRect().top;
      const elementTop = itemsDotRefs.current[id].getBoundingClientRect().top;
      const position = elementTop - containerTop;

      if (
        timelineActiveLineTop + TIMELINE_ACTIVE_LINE_HEIGHT / 3 <= position &&
        timelineActiveLineTop +
          TIMELINE_ACTIVE_LINE_HEIGHT +
          itemsDotRefs.current[id].offsetHeight >=
          position
      ) {
        return {
          backgroundColor: "var(--foreground)",
          transform: "scale(1.2)",
          opacity: 1,
        };
      } else {
        return {
          backgroundColor: "var(--foreground)",
        };
      }
    } else {
      return {};
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="gapL !gap-[200px]"
      style={{
        marginRight: TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT,
      }}
      initial={{
        opacity: 0,
        transform: "translateX(0px)",
      }}
      animate={{
        opacity: 1,
        transform: "translateX(30px)",
        transition: {
          opacity: {
            duration: CONTENT_INITIAL_OPACITY_ANIMATION_DURATION,
          },
          transform: {
            duration: TIMELINE_INITIAL_TRANSFORM_ANIMATION_DURATION,
            delay: TIMELINE_INITIAL_TRANSFORM_ANIMATION_DELAY_DURATION,
          },
        },
      }}
    >
      {items &&
        items.map((item, index) => (
          <div key={item.id} className="relative">
            <motion.div
              ref={(el: HTMLDivElement | null) => {
                itemsDotRefs.current[item.id] = el;
              }}
              className={twMerge(
                "rounded-full bg-[var(--foreground)] absolute -translate-y-1/2 -translate-x-1/2"
              )}
              style={{
                width: TIMELINE_DOT_SIZE,
                height: TIMELINE_DOT_SIZE,
                left: `-${TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT}px`,
                top: `${
                  isSet
                    ? Number(itemsHeaderRefs.current[item.id]?.offsetHeight) / 2
                    : "auto"
                }px`,
              }}
              initial={{
                opacity: 0,
                transform: `translateX(${TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT}px)`,
              }}
              animate={{
                opacity: dotStyles[item.id]?.opacity
                  ? dotStyles[item.id].opacity
                  : 0.2,
                transform: `translateX(0px) ${
                  dotStyles[item.id]?.transform
                    ? dotStyles[item.id].transform
                    : ""
                }`,
                transition: {
                  opacity: {
                    duration: TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION,
                    delay: dotAnimationDelays.opacity,
                  },
                  transform: {
                    duration: TIMELINE_INITIAL_TRANSFORM_ANIMATION_DURATION,
                    delay: dotAnimationDelays.transform,
                  },
                },
              }}
              onAnimationComplete={() => {
                setDotAnimationDelays({
                  transform: 0,
                  opacity: 0,
                });
              }}
            ></motion.div>

            <TimelineItem
              id={item.id}
              header={item.header}
              body={item.body}
              isCurrent={item.isCurrent}
              index={index}
            />
          </div>
        ))}
    </motion.div>
  );
}
