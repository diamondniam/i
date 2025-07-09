import { useEffect, useRef } from "react";

export function useScrollParallax<T extends HTMLElement | null>(
  ref: React.RefObject<T>
) {
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const animationRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      targetScroll.current = window.scrollY;
    };

    const animate = () => {
      currentScroll.current += targetScroll.current - currentScroll.current;

      if (ref.current) {
        ref.current.style.transform = `translateY(${currentScroll.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll);
    animate();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationRef.current);
    };
  }, [ref]);
}
