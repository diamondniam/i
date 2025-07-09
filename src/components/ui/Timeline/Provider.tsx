"use client";

import {
  Context as ContextProps,
  Provider as ProviderProps,
} from "@/components/ui/Timeline/types";
import { useResizeObserver } from "@/utils";
import {
  createContext,
  useRef,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";

const Context = createContext<ContextProps | null>(null);

const TIMELINE_DOT_SIZE = 20;
const TIMELINE_ACTIVE_LINE_HEIGHT = 300;
const TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT = 20;

const CONTENT_INITIAL_OPACITY_ANIMATION_DURATION = 1500 / 1000;
const TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION = 500 / 1000;
const TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION = 100 / 1000;
const TIMELINE_INITIAL_TRANSFORM_ANIMATION_DURATION = 500 / 1000;
const TIMELINE_INITIAL_TRANSFORM_ANIMATION_DELAY_DURATION = 500 / 1000;
const TIMELINE_ACTIVE_POSITION_INITIAL_OPACITY_ANIMATION_DURATION = 1000 / 1000;

export const useProvider = () => {
  const context = useContext(Context);
  if (!context) throw new Error("Must be used within a Provider");
  return context;
};

export const Provider = ({ children, highlightedMap }: ProviderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const itemsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemsHeaderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemsDotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [timelineActiveLineTop, setTimelineActiveLineTop] = useState(0);
  const [isActiveLineVisible, setIsActiveLineVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { width: containerWidth, height: containerHeight } =
    useResizeObserver<HTMLDivElement | null>({ ref: containerRef });

  const isSet = useMemo(() => {
    return !!(isMounted && containerRef.current);
  }, [itemsRefs.current, isMounted]);

  const handleScroll = () => {
    const clientHeight = window.innerHeight;
    const firstItemTimelineDot = itemsDotRefs.current[0];
    const lastItemTimelineDot =
      itemsDotRefs.current[itemsRefs.current.length - 1];

    if (
      lineRef.current &&
      firstItemTimelineDot?.offsetTop &&
      lastItemTimelineDot
    ) {
      const position =
        firstItemTimelineDot.getBoundingClientRect().bottom * -1 +
        clientHeight / 4;
      const maxPosition =
        lineRef.current.offsetHeight - TIMELINE_ACTIVE_LINE_HEIGHT / 2;
      const minPosition = 0 - TIMELINE_ACTIVE_LINE_HEIGHT / 2;
      const clampedY = Math.max(minPosition, Math.min(maxPosition, position));

      setTimelineActiveLineTop(clampedY);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleScroll();
      setIsActiveLineVisible(true);
    }, CONTENT_INITIAL_OPACITY_ANIMATION_DURATION * 1000);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSet]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Context.Provider
      value={{
        containerRef,
        itemsRefs,
        itemsHeaderRefs,
        lineRef,
        itemsDotRefs,

        TIMELINE_DOT_SIZE,
        TIMELINE_ACTIVE_LINE_HEIGHT,
        TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT,

        CONTENT_INITIAL_OPACITY_ANIMATION_DURATION,
        TIMELINE_INITIAL_OPACITY_ANIMATION_DURATION,
        TIMELINE_INITIAL_OPACITY_ANIMATION_DELAY_DURATION,
        TIMELINE_INITIAL_TRANSFORM_ANIMATION_DURATION,
        TIMELINE_INITIAL_TRANSFORM_ANIMATION_DELAY_DURATION,
        TIMELINE_ACTIVE_POSITION_INITIAL_OPACITY_ANIMATION_DURATION,

        isSet,
        timelineActiveLineTop,
        isActiveLineVisible,
        isMounted,

        highlightedMap,

        containerWidth,
        containerHeight,

        setTimelineActiveLineTop,
        setIsActiveLineVisible,
        setIsMounted,
      }}
    >
      {children}
    </Context.Provider>
  );
};
