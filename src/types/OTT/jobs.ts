import { CodeProps } from "@/components/ui/Code/types";
import { TimelineItem } from "@/components/ui/Timeline/types";

export interface JobOTTType extends TimelineItem {
  codePreview?: CodeProps;
}
