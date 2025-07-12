import { useEffect, useRef, useState } from "react";
import { frames } from "./utils/animation";
import { loadSpriteFrames, preloadImages, useActivePage } from "@/utils";

type Props = {
  isPointerOn: boolean;
};

const FRAME_DURATION = 100;

export default function NickRoomAnimation(props: Props) {
  const [frameIndex, setFrameIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
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
          let nextFrame;

          if (prev === frames.length - 1) {
            cancelAnimationFrame(animationFrameId.current!);
            nextFrame = prev;
          } else {
            nextFrame = prev + 1;
          }

          const { image, x, y, w, h } = frames[nextFrame];

          if (!image || !image.complete) {
            return prev;
          }

          if (ctx.current) {
            ctx.current.clearRect(0, 0, w, h);
            canvasRef.current!.width = w;
            canvasRef.current!.height = h;
            ctx.current.drawImage(image, x, y, w, h, 0, 0, w, h);
          }

          return nextFrame;
        } else {
          let nextFrame;

          if (prev === 1) {
            cancelAnimationFrame(animationFrameId.current!);
            nextFrame = prev - 1;
          }
          nextFrame = (prev - 1 + frames.length) % frames.length;

          const { image, x, y, w, h } = frames[nextFrame];

          if (!image || !image.complete) {
            return prev;
          }

          if (ctx.current) {
            ctx.current.clearRect(0, 0, w, h);
            canvasRef.current!.width = w;
            canvasRef.current!.height = h;
            ctx.current.drawImage(image, x, y, w, h, 0, 0, w, h);
          }

          return nextFrame;
        }
      });
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }
  }, [canvasRef]);

  useEffect(() => {
    if (isMounted.current && ctx.current) {
      cancelAnimationFrame(animationFrameId.current!);

      lastFrameTime.current = performance.now();
      direction.current = props.isPointerOn ? "forward" : "backward";

      loadSpriteFrames(frames).then(() => {
        animationFrameId.current = requestAnimationFrame(animate);
      });
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [props.isPointerOn]);

  useEffect(() => {
    setTimeout(() => {
      isMounted.current = true;
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <div className="absolute w-[209%] left-[45.5%] -top-[10.5%] -translate-x-1/2 pointer-events-none select-none max-w-none">
        <canvas ref={canvasRef} className="absolute w-full"></canvas>
      </div>
    </div>
  );
}
