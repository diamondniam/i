"use client";

import NickRoomPosters from "@/features/NickRoomPosters";
import { useNavigationStore } from "@/store";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import NickRoomPlayer from "@/features/NickRoomPlayer";

export default function NickRoom() {
  const { setNickRoomAnimating } = useNavigationStore();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setNickRoomAnimating(false);
    document.body.style.background = "var(--nick-room-bg)";
  }, []);

  const handleLinkClick = () => {
    window.open("https://diamondniam.github.io/nickroom/", "_blank");
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center pBody containerBody">
      <audio
        ref={audioRef}
        src="/audio/nickRoomSnippet.mp3"
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      ></audio>

      <Image
        src="/images/nickRoomPageAnimation/frame-10.png"
        fill
        alt="Nick Room Background"
        className="object-cover"
        sizes="100%"
        priority
      />

      <motion.button
        className="absolute top-5 right-5 h-[40px] w-[40px]"
        whileTap={{ filter: "brightness(0.9)" }}
        onClick={() => router.push("/")}
      >
        <Image src="/images/nickRoomClose.png" fill alt="Close" sizes="100%" />
      </motion.button>

      <div className="relative flex justify-center items-center flex-col gap-3 z-[2]">
        <Image
          src="/images/nickRoomTitle.png"
          alt="Nick Room Title"
          width={400}
          height={200}
          priority
        />

        <div className="flex gap-3">
          <NickRoomPlayer
            audioRef={audioRef}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />

          <motion.button
            whileTap={{ y: -1.05 }}
            onClick={() => handleLinkClick()}
          >
            <Image
              src="/images/nickRoomLink.png"
              alt="Nick Room Player"
              width={60}
              height={60}
              className="z-1 max-sm:w-[55px]"
            />
          </motion.button>
        </div>
      </div>

      <div className="absolute w-full h-full containerBody pointer-events-none select-none">
        <NickRoomPosters />
      </div>
    </div>
  );
}
