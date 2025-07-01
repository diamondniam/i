import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 100): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

type Size = {
  width: number;
  height: number;
};

type useResize = {
  debounceDelay: number;
  initResize?: boolean;
};

export function useResize(
  { debounceDelay, initResize }: useResize = {
    debounceDelay: 0,
    initResize: false,
  }
): Size {
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

  const handleResizeDebounced = useDebouncedCallback(handleResize, 100);

  useEffect(() => {
    if (debounceDelay > 0) {
      window.addEventListener("resize", handleResizeDebounced);
    } else {
      window.addEventListener("resize", handleResize);
    }

    if (initResize) {
      handleResize();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
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
