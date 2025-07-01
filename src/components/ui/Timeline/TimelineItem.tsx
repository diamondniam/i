"use client";

import { TimelineItemProps } from "@/components/ui/Timeline/types";

import { useProvider } from "@/components/ui/Timeline/Provider";

import { useFormatter } from "next-intl";
import TimelineItemDescription from "@/components/ui/Timeline/TimelineItemDescription";
import TimelineItemHeader from "@/components/ui/Timeline/TimelineItemHeader";

export default function TimelineItem(props: TimelineItemProps) {
  const format = useFormatter();
  const { itemsRefs, itemsHeaderRefs } = useProvider();

  return (
    <div
      ref={(el: HTMLDivElement | null) => {
        itemsRefs.current[props.id] = el;
      }}
      className="gapS"
    >
      <TimelineItemHeader {...props.header} id={props.id} index={props.index} />

      <TimelineItemDescription description={props.body.description} />
    </div>
  );
}
