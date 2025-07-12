import { TimelineItemHeaderTags } from "@/components/ui/Timeline/types";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  Transition,
  useInView,
} from "motion/react";
import { Size, useOpimizedAnimations, useResize } from "@/utils";
import { useGlobal } from "@/contexts/GlobalContext";

const TAG_ANIMATION_SCALE_INITIAL_AMOUNT = 0.3;
const TAG_ANIMATION_DELAY = 1;
const TAG_ANIMATION_DELAY_FACTOR = 0.1;

const SHOW_ALL_BUTTON_WIDTH = 28;

export default function TimelineItemTags({
  tags,
}: {
  tags: TimelineItemHeaderTags;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ghostContainerRef = useRef<HTMLDivElement>(null);

  const { hardware } = useGlobal();
  const [isOverflowing, setIsOverflowing] = useState(
    hardware.power === "high" ? true : false
  );
  const [maxContainerHeight, setMaxContainerHeight] = useState<number | "auto">(
    hardware.power === "high" ? 0 : "auto"
  );
  const isInView = useInView(containerRef, { once: true });
  const [isShowAll, setShowAll] = useState(false);

  const allTags = useMemo(() => [...tags.main, ...tags.other], [tags]);

  const [buttonsAnimations, setButtonsAnimations] = useState<
    Record<string, { animation: TargetAndTransition; transition: Transition }>
  >({});

  let windowSize: Size;

  const activeTags = useMemo(() => {
    if (isShowAll) {
      return allTags;
    } else {
      return tags.main;
    }
  }, [tags, isShowAll]);

  if (hardware.power === "high") {
    windowSize = useResize({ debounceDelay: 200 });

    useEffect(() => {
      setContainerHeight();
    }, [windowSize]);

    useEffect(() => {
      let newButtonAnimations: Record<
        string,
        { animation: TargetAndTransition; transition: Transition }
      > = {};

      activeTags.forEach((tag) => {
        const delay = isShowAll
          ? tags.other.indexOf(tag) * TAG_ANIMATION_DELAY_FACTOR
          : (allTags.indexOf(tag) + 1) * TAG_ANIMATION_DELAY_FACTOR +
            TAG_ANIMATION_DELAY;

        newButtonAnimations[tag.id] = {
          animation: {
            scale: isInView ? 1 : TAG_ANIMATION_SCALE_INITIAL_AMOUNT,
            y: isInView ? 0 : 100,
            display: "block",
          },
          transition: {
            duration: 0.5,
            delay,
          },
        };
      });

      const showAllDelay = isShowAll
        ? (tags.other.length + 1) * TAG_ANIMATION_DELAY_FACTOR +
          TAG_ANIMATION_DELAY
        : activeTags.length * TAG_ANIMATION_DELAY_FACTOR + TAG_ANIMATION_DELAY;

      newButtonAnimations["show-all"] = {
        animation: {
          scale: isInView ? 1 : TAG_ANIMATION_SCALE_INITIAL_AMOUNT,
          y: isInView ? 0 : 100,
        },
        transition: {
          duration: 0.5,
          delay: showAllDelay,
        },
      };

      setButtonsAnimations(newButtonAnimations);
    }, [activeTags, isInView, isShowAll]);
  }

  const setContainerHeight = () => {
    if (ghostContainerRef.current) {
      setMaxContainerHeight(ghostContainerRef.current.offsetHeight);
    }
  };

  return (
    <div className="relative">
      <motion.div
        ref={containerRef}
        className="flex gap-1 flex-wrap overflow-hidden mt-2 mb-3"
        animate={{
          overflow: isOverflowing ? "hidden" : "visible",
          maxHeight: maxContainerHeight,
        }}
        transition={{ duration: 0.5 }}
      >
        {activeTags.map((tag) => (
          <motion.button
            key={tag.id}
            className="px-1.5 py-0.5 rounded-sm !cursor-default"
            style={{
              color: tag.styles.color,
              backgroundColor: `${tag.styles.background}`,
            }}
            {...useOpimizedAnimations({
              hardware,
              animations: {
                initial: {
                  scale: TAG_ANIMATION_SCALE_INITIAL_AMOUNT,
                  y: 100,
                  display: !isShowAll ? "block" : "none",
                },
                animate: buttonsAnimations[tag.id]?.animation,
                transition: buttonsAnimations[tag.id]?.transition,
              },
              elseAnimations: {
                initial: {
                  opacity: 0,
                },
                animate: {
                  opacity: 1,
                },
                transition: {
                  duration: 0.5,
                },
              },
            })}
          >
            {tag.title}
          </motion.button>
        ))}

        <AnimatePresence mode="popLayout">
          {!isShowAll ? (
            <motion.button
              onClick={() => {
                setShowAll(true);
                setIsOverflowing(true);
              }}
              className="md:hover:-translate-y-0.5 max-md:active:-translate-y-0.5 active:brightness-90 transition-all z-[1]"
              {...useOpimizedAnimations({
                hardware,
                animations: {
                  initial: {
                    y: 100,
                  },
                  animate: buttonsAnimations["show-all"]?.animation,
                  transition: buttonsAnimations["show-all"]?.transition,
                  exit: {
                    opacity: 0,
                    transition: { duration: 0.5, delay: 0 },
                  },
                },
                elseAnimations: {
                  initial: {
                    opacity: 0,
                  },
                  animate: {
                    opacity: 1,
                  },
                  exit: {
                    opacity: 0,
                  },
                  transition: {
                    duration: 0.5,
                  },
                },
              })}
              onHoverStart={() => setIsOverflowing(false)}
            >
              <Image
                src="/images/add.svg"
                width={SHOW_ALL_BUTTON_WIDTH}
                height={28}
                alt="More icon"
              />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {isInView ? (
        <div
          ref={ghostContainerRef}
          className="absolute top-0 left-0 z-[-1000] flex gap-1 flex-wrap opacity-0 pointer-events-none"
        >
          {[...activeTags, { id: "show-all", title: "" }].map((tag) => (
            <motion.button
              key={tag.id}
              className="px-1.5 py-0.5 rounded-sm !cursor-default h-[28px]"
              style={{
                width: tag.id === "show-all" ? SHOW_ALL_BUTTON_WIDTH : "auto",
              }}
              initial={{
                display: !isShowAll ? "block" : "none",
              }}
              animate={buttonsAnimations[tag.id]?.animation}
              transition={buttonsAnimations[tag.id]?.transition}
              onAnimationComplete={setContainerHeight}
            >
              {tag.title}
            </motion.button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
