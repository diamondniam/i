"use client";

import { TimelineProps } from "@/components/ui/Timeline/types";

import { Provider } from "@/components/ui/Timeline/Provider";

import TimelinePosition from "@/components/ui/Timeline/TimelinePosition";
import TimelineItems from "@/components/ui/Timeline/TimelineItems";

export default function Timeline(props: TimelineProps) {
  return (
    <Provider highlightedMap={props.highlightedMap}>
      <div className="flex relative pl-3 overflow-hidden">
        <TimelinePosition />

        <TimelineItems>{props.children}</TimelineItems>
      </div>
    </Provider>
  );
}
