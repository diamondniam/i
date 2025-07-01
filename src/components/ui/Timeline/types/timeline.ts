import { TimelineItem } from "@/components/ui/Timeline/types/timelineItem";

export type TimelineProps = {
  children: React.ReactNode;
};

export type TimelinePosition = {
  items: TimelineItem[];
};
