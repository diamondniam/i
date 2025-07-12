import { frames } from "@/features/RennordAnimation/utils";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { loadSpriteFrames, useActivePage } from "@/utils";
import Image from "next/image";

interface RennordAnimationProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

const LAPTOP_OPENS_END_FRAME = 32;
const SCREEN_PAUSE_FOR_FRAMES = 40;
const SCREEN_QUANTITY = 2;
const BODY_ANIMATION_FRAMES =
  31 + (SCREEN_PAUSE_FOR_FRAMES - 1) * SCREEN_QUANTITY;

export default function RennordAnimation(props: RennordAnimationProps) {
  const isInView = useInView(props.containerRef, { amount: 0.8 });
  const targetFPS = 24;
  const frameDuration = 1000 / targetFPS;
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationFrameId = useRef<number | null>(null);
  const pageActive = useActivePage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const lastFrameTime = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }
  }, [canvasRef]);

  const animate = (currentTime: number) => {
    animationFrameId.current = requestAnimationFrame(animate);

    const delta = currentTime - lastFrameTime.current;

    if (delta >= frameDuration) {
      lastFrameTime.current = currentTime;

      setCurrentFrame((prev) => {
        const frameIndex = prev;
        const prevIncrement = frameIndex + 1;
        let nextFrame;

        const { image, x, y, w, h } = frames[frameIndex];

        if (!image) {
          throw new Error("Image not loaded");
        }

        if (!image.complete) {
          animationFrameId.current = requestAnimationFrame(animate);
          return prev;
        }

        if (ctx.current) {
          ctx.current.clearRect(0, 0, w, h);
          canvasRef.current!.width = w;
          canvasRef.current!.height = h;
          ctx.current.drawImage(image, x, y, w, h, 0, 0, w, h);
          setIsLoaded(true);
        }

        if (prevIncrement >= BODY_ANIMATION_FRAMES + LAPTOP_OPENS_END_FRAME) {
          nextFrame = LAPTOP_OPENS_END_FRAME;
        } else {
          nextFrame = prevIncrement;
        }

        return nextFrame;
      });
    }
  };

  useEffect(() => {
    if (ctx.current) {
      if (isInView) {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }

        loadSpriteFrames(frames).then(() => {
          animationFrameId.current = requestAnimationFrame(animate);
        });
      } else {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isInView, ctx.current]);

  return (
    <div className="absolute h-full sm:w-[60%] w-[90%] right-[calc(50%_+_20px)] translate-x-1/2">
      <canvas
        ref={canvasRef}
        className="absolute w-full h-full object-contain"
        style={{ display: isLoaded ? "block" : "none" }}
      ></canvas>

      {!isLoaded && (
        <Image
          src="/images/rennordAnimationMock.png"
          fill
          alt="Rennord"
          className="absolute w-full h-full object-contain"
          sizes="100%"
        />
      )}
    </div>
  );
}
