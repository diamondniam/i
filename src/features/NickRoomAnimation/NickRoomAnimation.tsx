"use client";

import { useEffect, useRef, useState } from "react";
import { frames } from "./utils";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store";
import { loadSpriteFrames, preloadImages, useActivePage } from "@/utils";

const FRAME_DURATION = 100;

export default function NickRoomAnimation() {
  const { nickRoom, setNickRoomAnimating } = useNavigationStore();

  const router = useRouter();
  const [frameIndex, setFrameIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(0);

  const direction = useRef<"forward" | "backwards" | undefined>("forward");

  const animate = (time: number) => {
    animationFrameId.current = requestAnimationFrame(animate);
    const delta = time - lastFrameTime.current;

    if (delta >= FRAME_DURATION) {
      lastFrameTime.current = time;

      setFrameIndex((prev) => {
        let nextFrame;
        if (direction.current === "forward") {
          if (prev === frames.length - 1) {
            cancelAnimationFrame(animationFrameId.current!);
            document.body.style.background = "var(--nick-room-bg)";
            router.push("/nickroom");
            nextFrame = prev;
          } else {
            nextFrame = prev + 1;
          }
        } else {
          if (prev === 1) {
            cancelAnimationFrame(animationFrameId.current!);
            setTimeout(() => {
              setNickRoomAnimating(false);
            }, FRAME_DURATION);
            nextFrame = prev - 1;
            if (ctx.current) {
              ctx.current.clearRect(
                0,
                0,
                canvasRef.current!.width,
                canvasRef.current!.height
              );
            }

            return nextFrame;
          } else {
            nextFrame = (prev - 1 + frames.length) % frames.length;
          }
        }

        const { image, x, y, w, h } = frames[nextFrame];

        if (!image || !image.complete) {
          return prev;
        }

        if (ctx.current) {
          ctx.current.clearRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
          canvasRef.current!.width = w;
          canvasRef.current!.height = h;
          ctx.current.drawImage(
            image,
            x,
            y,
            w,
            h,
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
        }

        return nextFrame;
      });
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (nickRoom.isAnimating) {
      direction.current = nickRoom.dir;

      lastFrameTime.current = performance.now();

      if (ctx.current) {
        loadSpriteFrames(frames).then(() => {
          animationFrameId.current = requestAnimationFrame(animate);
        });
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [nickRoom.isAnimating, ctx.current]);

  return (
    <div className="fixed inset-0 w-screen h-screen z-[1] pointer-events-none select-none">
      <canvas ref={canvasRef} className="w-full h-full object-cover"></canvas>
    </div>
  );
}
