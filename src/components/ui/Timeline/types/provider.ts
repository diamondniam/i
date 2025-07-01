export type Provider = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemsRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  itemsHeaderRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  itemsDotRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
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

  containerWidth: number;
  containerHeight: number;

  setTimelineActiveLineTop: (value: number) => void;
  setIsActiveLineVisible: (value: boolean) => void;
  setIsMounted: (value: boolean) => void;
};
