"use client";

import { useEffect, useRef, useState } from "react";
import { frames } from "./utils";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store";
import { preloadImages, useActivePage } from "@/utils";

const ANIMATION_FRAME_RATE = 100;

export default function NickRoomAnimation() {
  const { nickRoom, setNickRoomAnimating } = useNavigationStore();

  const router = useRouter();
  const interval = useRef<NodeJS.Timeout | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isPageActive = useActivePage();

  const animateForward = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      setFrameIndex((prev) => {
        if (prev === frames.length - 1) {
          if (interval.current) {
            clearInterval(interval.current);
          }
          document.body.style.background = "var(--nick-room-bg)";
          router.push("/nickroom");
          return prev;
        } else {
          return (prev + 1) % frames.length;
        }
      });
    }, ANIMATION_FRAME_RATE);
  };

  const animateBackwards = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      setFrameIndex((prev) => {
        if (prev === 1) {
          if (interval.current) {
            clearInterval(interval.current);
          }

          setTimeout(() => {
            setNickRoomAnimating(false);
            setIsAnimating(false);
          }, ANIMATION_FRAME_RATE);
          return prev - 1;
        } else {
          return (prev - 1 + frames.length) % frames.length;
        }
      });
    }, ANIMATION_FRAME_RATE);
  };

  useEffect(() => {
    if (nickRoom.isAnimating) {
      setIsAnimating(true);

      if (nickRoom.dir === "forward") {
        animateForward();
      } else if (nickRoom.dir === "backwards") {
        animateBackwards();
      }
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
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
