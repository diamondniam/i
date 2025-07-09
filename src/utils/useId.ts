import { useEffect, useRef } from "react";

export function useUID() {
  const ref = useRef("");

  useEffect(() => {
    ref.current = Math.round(Math.random() * Date.now()).toString(16);
  }, []);

  return ref.current;
}
