"use client";

import { TimelineItemProps } from "@/components/ui/Timeline/types";

import { useProvider } from "@/components/ui/Timeline/Provider";

import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

import TimelineItemDescription from "@/components/ui/Timeline/TimelineItemDescription";
import TimelineItemHeader from "@/components/ui/Timeline/TimelineItemHeader";
import { useEffect, useState } from "react";

export default function TimelineItem(props: TimelineItemProps) {
  const {
    itemsRefs,
    itemsHeaderRefs,
    itemsDotRefs,
    lineRef,

    TIMELINE_DOT_SIZE,
    TIMELINE_ACTIVE_LINE_HEIGHT,

    CONTENT_INITIAL_OPACITY_ANIMATION_DURATION,
    TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT,
    TIMELINE_INITIAL_TRANSFORM_ANIMATION_DELAY_DURATION,
    TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION,
    TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION,
    TIMELINE_INITIAL_TRANSFORM_ANIMATION_DURATION,

    isSet,
    timelineActiveLineTop,
  } = useProvider();

  const [dotStyles, setDotStyles] = useState<React.CSSProperties[]>([]);
  const [dotAnimationDelays, setDotAnimationDelays] = useState<
    Record<string, number>
  >({
    opacity:
      TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION +
      TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION,
  });

  useEffect(() => {
    if (isSet) {
      const newDotStyles: React.CSSProperties[] = [];
      itemsDotRefs.current.forEach((_, index) => {
        newDotStyles[index] = getIsInActiveLineRange(index);
      });
      setDotStyles(newDotStyles);
    }
  }, [isSet, timelineActiveLineTop, itemsDotRefs.current]);

  const getIsInActiveLineRange = (index: number) => {
    const firstItemTimelineDot = itemsDotRefs.current[0];

    if (
      itemsDotRefs.current[index] &&
      lineRef.current &&
      firstItemTimelineDot
    ) {
      const containerTop = firstItemTimelineDot.getBoundingClientRect().top;
      const elementTop =
        itemsDotRefs.current[index].getBoundingClientRect().top;
      const position = elementTop - containerTop;

      if (
        timelineActiveLineTop + TIMELINE_ACTIVE_LINE_HEIGHT / 3 <= position &&
        timelineActiveLineTop +
          TIMELINE_ACTIVE_LINE_HEIGHT +
          itemsDotRefs.current[index].offsetHeight >=
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
    <div
      ref={(el: HTMLDivElement | null) => {
        itemsRefs.current[props.index] = el;
      }}
      className="gapS relative"
    >
      <motion.div
        ref={(el: HTMLDivElement | null) => {
          itemsDotRefs.current[props.index] = el;
        }}
        className={twMerge(
          "rounded-full bg-[var(--foreground)] absolute -translate-y-1/2 -translate-x-1/2"
        )}
        style={{
          width: TIMELINE_DOT_SIZE,
          height: TIMELINE_DOT_SIZE,
          top: `${
            isSet
              ? Number(itemsHeaderRefs.current[props.index]?.offsetHeight) / 2
              : "auto"
          }px`,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: dotStyles[props.index]?.opacity
            ? dotStyles[props.index].opacity
            : 0.2,
        }}
        transition={{
          duration: TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION,
          delay: dotAnimationDelays.opacity,
        }}
        onAnimationComplete={() => {
          setDotAnimationDelays({
            transform: 0,
            opacity: 0,
          });
        }}
        viewport={{ once: true }}
      ></motion.div>

      <motion.div
        className="gapS"
        initial={{
          opacity: 0,
          transform: "translateX(0px)",
        }}
        animate={{
          opacity: 1,
          transform: `translateX(${TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT}px)`,
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
        <div className="gapS">
          <TimelineItemHeader
            {...props.header}
            id={props.id}
            index={props.index}
          />

          <TimelineItemDescription description={props.body.description} />
        </div>

        <div>{props.children}</div>
      </motion.div>
    </div>
  );
}
