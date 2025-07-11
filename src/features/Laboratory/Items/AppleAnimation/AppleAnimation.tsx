"use client";

import LaboratoryItem from "@/features/Laboratory/LaborarotyItem";
import Image from "next/image";
import laboratory from "@public/data/laboratory.json";
import Animation from "@/features/Laboratory/Items/AppleAnimation/Animation";
import { useRef, useState } from "react";
import { AnimatePresence, useInView } from "motion/react";
import { motion } from "motion/react";
import { useFooterPhone } from "@/contexts";
import "./styles.css";
import { useIsHoverDevice } from "@/utils";

const appleAnimation = laboratory[1];

const animationsContainer = {
  active: {
    y: 0,
    scale: 1.05,
    rotateZ: -1,
    rotateY: -2,
  },
  clicked: {
    y: -2,
    scale: 1.05,
    rotateZ: -1,
    rotateY: -2,
  },
  inactive: {
    y: 0,
    scale: 1,
    rotateZ: 0,
    rotateY: 0,
  },
};

const animationsBorder = {
  initial: {
    waveAmplitude: { min: 5, max: 10 },
    waveSpawnInterval: 2,
    gradientInterval: 2,
  },
  active: {
    waveAmplitude: { min: 15, max: 25 },
    waveSpawnInterval: 0.5,
    gradientInterval: 1,
  },
};

export default function AppleAnimation() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef);

  const { laboratoryPhoneRef } = useFooterPhone();

  const pointerAnimationTimeout = useRef<NodeJS.Timeout | null>(null);
  const [waveAmplitude, setWaveAmplitude] = useState(
    animationsBorder.initial.waveAmplitude
  );
  const [waveSpawnInterval, setWaveSpawnInterval] = useState(
    animationsBorder.initial.waveSpawnInterval
  );
  const [gradientInterval, setGradientInterval] = useState(
    animationsBorder.initial.gradientInterval
  );

  const handlePointerEnter = () => {
    if (useIsHoverDevice()) {
      if (pointerAnimationTimeout.current) {
        clearTimeout(pointerAnimationTimeout.current);
      }

      pointerAnimationTimeout.current = setTimeout(() => {
        setWaveAmplitude(animationsBorder.active.waveAmplitude);
        setWaveSpawnInterval(animationsBorder.active.waveSpawnInterval);
        setGradientInterval(animationsBorder.active.gradientInterval);
      }, 300);
    }
  };
  const handlePointerLeave = () => {
    if (useIsHoverDevice()) {
      if (pointerAnimationTimeout.current) {
        clearTimeout(pointerAnimationTimeout.current);
      }
      pointerAnimationTimeout.current = setTimeout(() => {
        setWaveAmplitude(animationsBorder.initial.waveAmplitude);
        setWaveSpawnInterval(animationsBorder.initial.waveSpawnInterval);
        setGradientInterval(animationsBorder.initial.gradientInterval);
      }, 300);
    }
  };

  return (
    <LaboratoryItem
      refs={{
        container: containerRef,
      }}
      title={appleAnimation.title}
      description={appleAnimation.description}
      classNames={{
        container: "row-span-2 max-lg:order-2",
        children: "[perspective:100px]",
      }}
    >
      <motion.button
        ref={laboratoryPhoneRef as React.RefObject<HTMLButtonElement>}
        className="relative w-[200px] h-[420px] cursor-pointer flex justify-center items-center"
        variants={animationsContainer}
        whileTap={"clicked"}
        whileHover={useIsHoverDevice() ? "active" : undefined}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        onClick={() => {
          window.open(appleAnimation.link as string, "_blank");
        }}
      >
        <Image
          src="/images/laboratoryAppleAnimationScreenEmpty.png"
          alt="apple animation"
          fill
          className="object-cover"
          sizes="100%"
        ></Image>

        <Image
          src="/images/laboratoryAppleAnimationScreen.png"
          alt="apple animation"
          fill
          className="object-cover"
          sizes="100%"
        ></Image>

        <AnimatePresence>
          {isInView && (
            <div className="w-[185px] ml-[1px] h-[402px] overflow-hidden rounded-[28px] will-change-transform">
              <motion.div
                className="relative flex items-center justify-center w-full h-full will-change-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <Animation
                  width={190}
                  height={410}
                  radius={25}
                  pointsPerMaxEdge={60}
                  waveAmplitude={waveAmplitude}
                  waveLength={{ min: 10, max: 20 }}
                  waveSpawnInterval={waveSpawnInterval}
                  gradientInterval={gradientInterval}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.button>
    </LaboratoryItem>
  );
}
