import { CodeProps } from "@/components/ui/Code/types";

export type Context = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemsRefs: React.RefObject<(HTMLDivElement | null)[]>;
  itemsHeaderRefs: React.RefObject<(HTMLDivElement | null)[]>;
  itemsDotRefs: React.RefObject<(HTMLDivElement | null)[]>;
  lineRef: React.RefObject<HTMLDivElement | null>;

  CONTENT_INITIAL_OPACITY_ANIMATION_DURATION: number;
  TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION: number;
  TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION: number;
  TIMELINE_INITIAL_TRANSFORM_ANIMATION_DURATION: number;
  TIMELINE_INITIAL_TRANSFORM_ANIMATION_DELAY_DURATION: number;
  TIMELINE_ACTIVE_POSITION_INITIAL_OPACITY_ANIMATION_DURATION: number;

  TIMELINE_DOT_SIZE: number;
  TIMELINE_ACTIVE_LINE_HEIGHT: number;
  TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT: number;

  isSet: boolean;
  timelineActiveLineTop: number;
  isActiveLineVisible: boolean;
  isMounted: boolean;

  highlightedMap?: Record<string, CodeProps>;

  containerWidth: number;
  containerHeight: number;

  setTimelineActiveLineTop: (value: number) => void;
  setIsActiveLineVisible: (value: boolean) => void;
  setIsMounted: (value: boolean) => void;
};

export type Provider = {
  children: React.ReactNode;
  highlightedMap?: Record<string, CodeProps>;
};
