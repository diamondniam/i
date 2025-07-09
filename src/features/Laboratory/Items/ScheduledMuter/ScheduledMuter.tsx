"use client";

import LaboratoryItem from "@/features/Laboratory/LaborarotyItem";
import laboratory from "@public/data/laboratory.json";
import Image from "next/image";

import { motion } from "motion/react";

const scheduledMuter = laboratory[2];

const animationsContainer = {
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

export default function ScheduledMuter() {
  return (
    <LaboratoryItem
      title={scheduledMuter.title}
      description={scheduledMuter.description}
      classNames={{
        container: "row-span-1",
        children: "[perspective:100px]",
      }}
    >
      <motion.button
        className="relative min-w-[200px] min-h-[200px] cursor-pointer"
        initial="inactive"
        whileHover="active"
        whileTap="clicked"
        variants={animationsContainer}
        onClick={() => {
          window.open(scheduledMuter.link as string, "_blank");
        }}
      >
        <Image
          src="/images/laboratoryScheduledMuter.png"
          fill
          priority
          alt="Scheduled Muter"
          className="object-cover object-[center_19%] rounded-lg"
          sizes="100%"
        />
      </motion.button>
    </LaboratoryItem>
  );
}
