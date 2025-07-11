import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { frames } from "@/features/NickRoomPlayer/utils";

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
  const [isAnimating, setIsAnimating] = useState(false);
  const interval = useRef<NodeJS.Timeout | null>(null);

  const playAnimation = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      setPlayerFrame((prev) => {
        if (prev === frames.length - 1) {
          if (interval.current) {
            clearInterval(interval.current);
          }
          setIsAnimating(false);
          return prev;
        } else {
          return (prev + 1) % frames.length;
        }
      });
    }, ANIMATION_FRAME_RATE);
  };

  const stopAnimation = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      setPlayerFrame((prev) => {
        if (prev === 1) {
          if (interval.current) {
            clearInterval(interval.current);
          }
          setIsAnimating(false);
          return prev - 1;
        } else {
          return (prev - 1 + frames.length) % frames.length;
        }
      });
    }, ANIMATION_FRAME_RATE);
  };

  const handlePlayerClick = () => {
    if (audioRef.current && !isAnimating) {
      if (isPlaying) {
        stopAnimation();
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        playAnimation();
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  return (
    <motion.button whileTap={{ y: -1.05 }} onClick={() => handlePlayerClick()}>
      <Image
        src={frames[playerFrame]}
        alt="Nick Room Player"
        width={60}
        height={60}
        className="z-1 max-sm:w-[55px]"
      />
    </motion.button>
  );
}
