"use client";

import LaboratoryItem from "@/features/Laboratory/LaborarotyItem";
import Image from "next/image";
import laboratory from "@public/data/laboratory.json";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, useInView } from "motion/react";
import { motion } from "motion/react";
import { useFooterPhone } from "@/contexts";
import "./styles.css";
import { getIsHoverDevice } from "@/utils";
import Canvas, { SetCanvasProps } from "@border-waves/core";

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
  const isInView = useInView(containerRef, { amount: 0.8 });
  const animationRef = useRef<HTMLCanvasElement | null>(null);
  const animationCanvasClass = useRef<Canvas | null>(null);

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

  const animationCanvasOptions: SetCanvasProps = {
    blur: "4px",
    waveAmplitude,
    waveSpawnInterval,
    gradientInterval,
    width: 190,
    height: 410,
    radius: 25,
    pointsPerMaxEdge: 60,
    waveLength: { min: 10, max: 20 },
  };

  const handlePointerEnter = () => {
    if (getIsHoverDevice()) {
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
    if (getIsHoverDevice()) {
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

  useEffect(() => {
    if (animationCanvasClass.current) {
      animationCanvasClass.current.setCanvas(animationCanvasOptions);
    }
  }, [waveAmplitude, waveSpawnInterval, gradientInterval]);

  useEffect(() => {
    if (animationRef.current && isInView) {
      animationCanvasClass.current = new Canvas({
        el: animationRef.current,
        ...animationCanvasOptions,
      });
    }
  }, [isInView]);

  return (
    <LaboratoryItem
      id="apple-animation"
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
        whileHover={getIsHoverDevice() ? "active" : undefined}
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

        <AnimatePresence mode="wait">
          {isInView && (
            <div className="w-[185px] ml-[1px] h-[402px] overflow-hidden rounded-[28px] will-change-transform">
              <motion.div
                className="relative flex items-center justify-center w-full h-full will-change-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <canvas ref={animationRef}></canvas>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.button>
    </LaboratoryItem>
  );
}
