"use client";

import { TimelineProps } from "@/components/ui/Timeline/types";

import { Provider } from "@/components/ui/Timeline/Provider";

import TimelinePosition from "@/components/ui/Timeline/TimelinePosition";
import TimelineItems from "@/components/ui/Timeline/TimelineItems";

export default function Timeline(props: TimelineProps) {
  return (
    <Provider items={props.items}>
      <div id="timeline" className="flex relative pl-4 overflow-hidden">
        <TimelinePosition items={props.items} />

        <TimelineItems items={props.items} />
      </div>
    </Provider>
  );
}
