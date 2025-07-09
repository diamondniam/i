import { useEffect, useRef } from "react";

const ANIMATION_FACTOR = 0.01;

export default function Svg({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current);
      const animatableElements = ref.current.querySelectorAll("#animatable");

      console.log(animatableElements);

      animatableElements.forEach((element, index) => {
        console.log(element, element instanceof HTMLElement);
        if (element instanceof HTMLElement) {
          element.style.transform = "scale(0.5)";
          element.style.transition = `transform ${1}s ease-in-out ${1 + index * ANIMATION_FACTOR}s`;
        }
      });

      animatableElements.forEach((element, index) => {
        if (element instanceof HTMLElement) {
          element.style.transform = "scale(1)";
        }
      });
    }
  }, [ref]);

  return <div ref={ref}>{children}</div>;
}
