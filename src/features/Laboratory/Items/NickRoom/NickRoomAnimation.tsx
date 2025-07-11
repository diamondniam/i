import { useEffect, useRef, useState } from "react";
import { frames } from "./utils/animation";
import { preloadImages, useActivePage } from "@/utils";

type Props = {
  isPointerOn: boolean;
};

const FRAME_DURATION = 100;

export default function NickRoomAnimation(props: Props) {
  const [frameIndex, setFrameIndex] = useState(0);
  const isPageActive = useActivePage();
  const direction = useRef<"forward" | "backward">("forward");
  const animationFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef(0);
  const isMounted = useRef(false);

  const animate = (time: number) => {
    animationFrameId.current = requestAnimationFrame(animate);

    const delta = time - lastFrameTime.current;

    if (delta >= FRAME_DURATION) {
      lastFrameTime.current = time;

      setFrameIndex((prev) => {
        if (direction.current === "forward") {
          if (prev === frames.length - 1) {
            cancelAnimationFrame(animationFrameId.current!);
            return prev;
          }
          return prev + 1;
        } else {
          if (prev === 1) {
            cancelAnimationFrame(animationFrameId.current!);
            return prev - 1;
          }
          return (prev - 1 + frames.length) % frames.length;
        }
      });
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      cancelAnimationFrame(animationFrameId.current!);

      lastFrameTime.current = performance.now();
      direction.current = props.isPointerOn ? "forward" : "backward";

      animationFrameId.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [props.isPointerOn, isMounted]);

  useEffect(() => {
    if (isPageActive) {
      preloadImages(frames);
    }
  }, [isPageActive]);

  useEffect(() => {
    setTimeout(() => {
      isMounted.current = true;
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <div className="absolute w-[206%] left-[46%] -top-[9.5%] -translate-x-1/2 pointer-events-none select-none max-w-none">
        <img
          src={frames[frameIndex]}
          alt="Animation frame"
          className="absolute"
        />
      </div>
    </div>
  );
}
