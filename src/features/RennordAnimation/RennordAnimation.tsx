import Image from "next/image";

import { frames } from "@/features/RennordAnimation/utils";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { preloadImages, useActivePage } from "@/utils";

const LAPTOP_OPENS_END_FRAME = 32;
const BODY_ANIMATION_FRAMES = 118;

export default function RennordAnimation() {
  const imageRef = useRef<HTMLImageElement>(null);
  const isInView = useInView(imageRef, { amount: 0.8 });
  const targetFPS = 30;
  const frameDuration = 1000 / targetFPS;
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationFrameId = useRef<number | null>(null);
  const pageActive = useActivePage();

  let lastFrameTime = useRef(0);

  const animate = (currentTime: number) => {
    animationFrameId.current = requestAnimationFrame(animate);

    const delta = currentTime - lastFrameTime.current;

    if (delta >= frameDuration) {
      lastFrameTime.current = currentTime;
      setCurrentFrame((prev) => {
        const frameIndex = prev + 1;

        if (frameIndex >= BODY_ANIMATION_FRAMES + LAPTOP_OPENS_END_FRAME) {
          return LAPTOP_OPENS_END_FRAME;
        } else {
          return frameIndex;
        }
      });
    }
  };

  useEffect(() => {
    if (pageActive) {
      preloadImages(frames);
    }
  }, [pageActive]);

  useEffect(() => {
    if (isInView) {
      lastFrameTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isInView]);

  return (
    <div
      ref={imageRef}
      className="absolute h-full sm:w-[90%] w-[140%] max-sm:-right-[12%]"
    >
      <Image
        src={frames[currentFrame]}
        fill
        alt="Rennord Animation"
        sizes="100%"
        className="object-contain"
        priority
      />
    </div>
  );
}
