import { CodeProps } from "@/components/ui/Code/types";
import { TimelineItem } from "@/components/ui/Timeline/types/timelineItem";

export type TimelineProps = {
  children: React.ReactNode;
  highlightedMap?: Record<string, CodeProps>;
};

export type TimelinePosition = {
  items: TimelineItem[];
};
