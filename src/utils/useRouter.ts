import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

export function usePreviousRoute() {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    previousPathRef.current = pathname;
  }, [pathname]);

  return previousPathRef.current;
}
