import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { frames } from "@/features/NickRoomPlayer/utils";
import { loadSpriteFrames } from "@/utils";

type NickRoomPlayerProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
};

const ANIMATION_FRAME_RATE = 100;

export default function NickRoomPlayer({
  audioRef,
  isPlaying,
  setIsPlaying,
}: NickRoomPlayerProps) {
  const [playerFrame, setPlayerFrame] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const targetFPS = 5;
  const frameDuration = 1000 / targetFPS;
  const lastFrameTime = useRef(0);
  const direction = useRef<"forward" | "backwards" | undefined>("forward");
  const animationFrameId = useRef<number | null>(null);
  const isMounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const animate = (time: number) => {
    animationFrameId.current = requestAnimationFrame(animate);

    const delta = time - lastFrameTime.current;

    if (delta >= frameDuration) {
      lastFrameTime.current = time;

      setPlayerFrame((prev) => {
        let nextFrame;

        if (direction.current === "forward") {
          if (prev === frames.length - 1) {
            setIsAnimating(false);
            nextFrame = prev;

            if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
            }
          } else {
            nextFrame = (prev + 1) % frames.length;
          }
        } else {
          if (prev === 1) {
            setIsAnimating(false);
            nextFrame = prev - 1;

            if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
            }
          } else {
            nextFrame = (prev - 1 + frames.length) % frames.length;
          }
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
          setIsLoaded(true);
        }

        return nextFrame;
      });
    }
  };

  const handlePlayerClick = () => {
    if (audioRef.current && !isAnimating) {
      if (isPlaying) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }
  }, [canvasRef]);

  useEffect(() => {
    if (audioRef.current && isMounted.current) {
      direction.current = isPlaying ? "forward" : "backwards";

      if (isPlaying) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }

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
  }, [isPlaying]);

  useEffect(() => {
    setTimeout(() => {
      isMounted.current = true;
    });
  }, []);

  return (
    <motion.button whileTap={{ y: -1.05 }} onClick={() => handlePlayerClick()}>
      <canvas
        ref={canvasRef}
        className="z-1 w-[60px] max-sm:w-[55px]"
        style={{ display: isLoaded ? "block" : "none" }}
      ></canvas>

      {!isLoaded && (
        <Image
          src="/images/nickRoomPlayerAnimationMock.png"
          alt="Nick Room Player"
          width={60}
          height={60}
          className="z-0"
        />
      )}
    </motion.button>
  );
}
