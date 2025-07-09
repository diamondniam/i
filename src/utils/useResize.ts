import { WindowEventUtil } from "@/types";
import { useDebouncedCallback } from "@/utils/useDebounce";
import { useEffect, useState } from "react";

type Size = {
  width: number;
  height: number;
};

export function useResize(
  { debounceDelay, initial }: WindowEventUtil = {
    debounceDelay: 0,
    initial: false,
  }
): Size {
  debounceDelay = debounceDelay && debounceDelay > 0 ? debounceDelay : 0;

  const [size, setSize] = useState<Size>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const handleResize = () => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const handleResizeDebounced = useDebouncedCallback({
    callback: handleResize,
  });

  useEffect(() => {
    if (debounceDelay > 0) {
      window.addEventListener("resize", handleResizeDebounced);
    } else {
      window.addEventListener("resize", handleResize);
    }

    if (initial) {
      handleResize();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResizeDebounced);
    };
  }, []);

  return size;
}

export function useResizeObserver<T extends HTMLElement | null>({
  ref,
}: {
  ref: React.RefObject<T>;
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, ...size };
}
