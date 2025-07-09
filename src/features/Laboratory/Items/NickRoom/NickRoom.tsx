"use client";

import NickRoomAnimation from "@/features/Laboratory/Items/NickRoom/NickRoomAnimation";
import LaboratoryItem from "@/features/Laboratory/LaborarotyItem";
import laboratory from "@public/data/laboratory.json";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useIsHoverDevice } from "@/utils";
import { useNavigationStore } from "@/store";

export default function NickRoom() {
  const [isPointerOn, setIsPointerOn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerTimeout = useRef<NodeJS.Timeout | null>(null);
  const isInView = useInView(containerRef, { amount: 0.5 });

  const { setNickRoomAnimating, setNickRoomAnimatingDir } =
    useNavigationStore();

  const handlePointerOn = () => {
    if (useIsHoverDevice()) {
      if (pointerTimeout.current) {
        clearTimeout(pointerTimeout.current);
      }

      setIsPointerOn(true);
    }
  };

  const handleClick = () => {
    if (!useIsHoverDevice()) {
      setIsPointerOn(true);
    }

    setNickRoomAnimatingDir("forward");
    setNickRoomAnimating(true);
  };

  const handlePointerLeave = () => {
    if (useIsHoverDevice()) {
      if (pointerTimeout.current) {
        clearTimeout(pointerTimeout.current);
      }
      pointerTimeout.current = setTimeout(() => {
        setIsPointerOn(false);
      }, 100);
    }
  };

  const animations = {
    active: {
      y: 0,
      scale: 1.05,
      rotateZ: -1,
      rotateY: 2,
    },
    clicked: {
      y: -2,
      scale: 1.05,
      rotateZ: -1,
      rotateY: 2,
    },
    inactive: {
      y: 0,
      scale: 1,
      rotateZ: 0,
      rotateY: 0,
    },
  };

  useEffect(() => {
    if (!useIsHoverDevice()) {
      if (isInView) {
        setIsPointerOn(true);
      } else {
        setIsPointerOn(false);
      }
    }
  }, [isInView]);

  return (
    <LaboratoryItem
      refs={{ container: containerRef }}
      title={laboratory[0].title}
      description={laboratory[0].description}
      classNames={{
        container: "row-span-1 relative z-[1]",
        children: "[perspective:100px]",
      }}
    >
      <motion.div
        className="relative cursor-pointer will-change-transform preserve-3d min-w-[200px] h-[200px]"
        onPointerEnter={handlePointerOn}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        onClick={handleClick}
        variants={animations}
        whileTap={"clicked"}
        whileHover={"active"}
      >
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <Image
            src="/images/laboratoryNickRoom.jpg"
            fill
            alt="Nick Room"
            priority
            className="object-cover object-[center_70%]"
            sizes="100%"
          />
        </div>

        <NickRoomAnimation isPointerOn={isPointerOn} />
      </motion.div>
    </LaboratoryItem>
  );
}
