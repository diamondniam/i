import React, { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getRandom } from "@/utils";
import { pulseLineClasses } from "./utils";
import { animatedPreloaderLineId } from "./PreloaderContainer";

type Range = {
  min: number;
  max: number;
};

type Options = {
  isAnimated?: boolean;
  randomWidth?: boolean;
  range?: Range;
};

type Props = {
  options?: Options;
  className?: string;
};

const defaultRange: Range = {
  min: 50,
  max: 150,
};

export default function PreloaderLine({ options, className }: Props) {
  const shouldAnimate = useMemo<boolean>(() => {
    return options?.isAnimated !== false;
  }, [options?.isAnimated]);

  const randomWidthEnabled = useMemo<boolean>(() => {
    return options?.randomWidth !== false;
  }, [options?.randomWidth]);

  const [randomOffset, setRandomOffset] = useState<number | null>(null);

  useEffect(() => {
    if (randomWidthEnabled) {
      setRandomOffset(
        getRandom(
          options?.range?.min ?? defaultRange.min,
          options?.range?.max ?? defaultRange.max
        )
      );
    }
  }, [randomWidthEnabled, options?.range]);

  const style = useMemo(() => {
    return {
      width: `calc(100% - ${randomOffset}px)`,
    };
  }, [randomOffset, randomWidthEnabled]);

  return (
    <div
      id={shouldAnimate ? animatedPreloaderLineId : undefined}
      className={twMerge(
        pulseLineClasses,
        "h-6 w-full relative flex items-center justify-center bg-gray-100 rounded-lg",
        className
      )}
      style={style}
    />
  );
}
