import { TimelineItemHeaderProps } from "@/components/ui/Timeline/types";

import { Text } from "@/components/animations";
import TimelineItemTags from "@/components/ui/Timeline/TimelineItemTags";
import { LinkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { motion, useInView } from "motion/react";

import { useProvider } from "@/components/ui/Timeline/Provider";
import { useRef, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useGlobal } from "@/contexts/GlobalContext";
import { useOpimizedAnimations } from "@/utils";

export default function TimelineItemHeader(props: TimelineItemHeaderProps) {
  const { itemsHeaderRefs } = useProvider();

  const [linkAnimation, setLinkAnimation] = useState({
    styles: {
      scale: 1,
      opacity: 1,
    },
    duration: 0.5,
    delay: props.title.length * 0.05 + 1,
  });
  const titleRef = useRef<HTMLDivElement>(null);
  const jobPositionRef = useRef<HTMLDivElement>(null);
  const format = useFormatter();
  const t = useTranslations();

  const { hardware } = useGlobal();

  let isTitleInView: boolean = false;
  let isJobPositionInView: boolean = false;

  if (hardware.power === "high") {
    isJobPositionInView = useInView(jobPositionRef, { once: true });
    isTitleInView = useInView(titleRef, { once: true });
  }

  return (
    <div
      ref={(el: HTMLDivElement | null) => {
        itemsHeaderRefs.current[props.index] = el;
      }}
    >
      <motion.div
        className="textXS text-[var(--gray)] font-light"
        {...useOpimizedAnimations({
          hardware,
          animations: {
            initial: { opacity: 0, x: 100 },
            transition: { delay: 1, duration: 0.5 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true, amount: 0.2 },
          },
        })}
      >
        {format.dateTime(new Date(props.dateRange[0]), "short")} -{" "}
        {props.dateRange[1] === "present"
          ? t("components.timeline.item.header.present")
          : format.dateTime(new Date(props.dateRange[1]), "short")}
      </motion.div>

      <div className="flex gap-1 items-center">
        <h2 ref={titleRef} className="textL">
          {hardware.power === "high" ? (
            <Text
              text={props.title}
              letterArgs={{
                animate: isTitleInView ? "visible" : "hidden",
              }}
              delay={0.5}
            />
          ) : (
            props.title
          )}
        </h2>

        {props.url && (
          <Link href={props.url} target="_blank" className="flex-none">
            <motion.div
              {...useOpimizedAnimations({
                hardware,
                animations: {
                  initial: { opacity: 0, scale: 0.5 },
                  whileInView: linkAnimation.styles,
                  viewport: { once: true },
                  transition: {
                    delay: linkAnimation.delay,
                    duration: linkAnimation.duration,
                  },
                },
              })}
              onHoverStart={() => {
                setLinkAnimation({
                  ...linkAnimation,
                  delay: 0,
                  duration: 0.3,
                  styles: {
                    scale: 1.1,
                    opacity: 1,
                  },
                });
              }}
              onHoverEnd={() => {
                setLinkAnimation({
                  ...linkAnimation,
                  styles: {
                    scale: 1,
                    opacity: 1,
                  },
                });
              }}
            >
              <LinkIcon
                className="w-6"
                strokeWidth={2}
                color="var(--secondary)"
              />
            </motion.div>
          </Link>
        )}
      </div>

      <div
        ref={jobPositionRef}
        className="text-[var(--gray)] textM !font-light overflow-hidden"
      >
        <motion.p
          {...useOpimizedAnimations({
            hardware,
            animations: {
              initial: { y: 60 },
              animate: isJobPositionInView ? { y: 0 } : { y: 60 },
              transition: { delay: 1.5, duration: 0.5 },
            },
          })}
        >
          {props.position}
        </motion.p>
      </div>

      <TimelineItemTags tags={props.tags} />
    </div>
  );
}
