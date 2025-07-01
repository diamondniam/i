import { Text } from "@/components/animations";
import { useProvider } from "@/components/ui/Timeline/Provider";
import TimelineItemTags from "@/components/ui/Timeline/TimelineItemTags";
import { TimelineItemHeaderProps } from "@/components/ui/Timeline/types";
import { LinkIcon } from "@heroicons/react/24/outline";
import { motion, useInView } from "motion/react";
import { useFormatter } from "next-intl";
import Link from "next/link";
import { useRef, useState } from "react";

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
  const isTitleInView = useInView(titleRef, { once: true });
  const jobPositionRef = useRef<HTMLDivElement>(null);
  const isJobPositionInView = useInView(jobPositionRef, { once: true });
  const format = useFormatter();

  return (
    <div
      ref={(el: HTMLDivElement | null) => {
        itemsHeaderRefs.current[props.id] = el;
      }}
    >
      <motion.div
        className="textXS text-[var(--gray)] font-light"
        initial={{ opacity: 0, x: 100 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        {format.dateTime(new Date(props.dateRange[0]), "short")} -{" "}
        {format.dateTime(new Date(props.dateRange[1]), "short")}
      </motion.div>

      <div className="flex gap-1 items-center">
        <h2 ref={titleRef} className="textL">
          <Text
            text={props.title}
            letterArgs={{
              animate: isTitleInView ? "visible" : "hidden",
            }}
          />
        </h2>

        {props.url && (
          <Link href={props.url} target="_blank" className="flex-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              transition={{
                delay: linkAnimation.delay,
                duration: linkAnimation.duration,
              }}
              whileInView={linkAnimation.styles}
              viewport={{ once: true }}
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
          initial={{ y: 40 }}
          animate={isJobPositionInView ? { y: 0 } : { y: 40 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {props.position}
        </motion.p>
      </div>

      <TimelineItemTags tags={props.tags} />
    </div>
  );
}
