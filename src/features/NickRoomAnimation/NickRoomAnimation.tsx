"use client";

import { useEffect, useRef, useState } from "react";
import { frames } from "./utils";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store";
import { preloadImages, useActivePage } from "@/utils";

const FRAME_DURATION = 100;

export default function NickRoomAnimation() {
  const { nickRoom, setNickRoomAnimating } = useNavigationStore();

  const router = useRouter();
  const [frameIndex, setFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isPageActive = useActivePage();
  const animationFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(0);

  const direction = useRef<"forward" | "backwards" | undefined>("forward");

  const animate = (time: number) => {
    animationFrameId.current = requestAnimationFrame(animate);
    const delta = time - lastFrameTime.current;

    if (delta >= FRAME_DURATION) {
      lastFrameTime.current = time;

      setFrameIndex((prev) => {
        if (direction.current === "forward") {
          if (prev === frames.length - 1) {
            cancelAnimationFrame(animationFrameId.current!);
            document.body.style.background = "var(--nick-room-bg)";
            router.push("/nickroom");
            return prev;
          }
          return prev + 1;
        } else {
          if (prev === 1) {
            cancelAnimationFrame(animationFrameId.current!);
            setTimeout(() => {
              setNickRoomAnimating(false);
              setIsAnimating(false);
            }, FRAME_DURATION);
            return prev - 1;
          }
          return (prev - 1 + frames.length) % frames.length;
        }
      });
    }
  };

  useEffect(() => {
    if (nickRoom.isAnimating) {
      setIsAnimating(true);
      direction.current = nickRoom.dir;

      lastFrameTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [nickRoom.isAnimating]);

  useEffect(() => {
    if (isPageActive) {
      preloadImages(frames);
    }
  }, [isPageActive]);

  if (isAnimating) {
    return (
      <div className="fixed inset-0 w-screen h-screen z-[1] pointer-events-none select-none">
        <img
          src={frames[frameIndex]}
          alt="Nick Room Page Animation"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
}
