import Image from "next/image";
import { posters } from "./utils";
import { twMerge } from "tailwind-merge";

import { motion } from "motion/react";

const aniations = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: -20,
  },
};

export default function NickRoomPosters() {
  return (
    <div className="absolute w-full h-full flex items-center justify-center [perspective:200px]">
      {posters.map((poster, index) => (
        <motion.div
          key={index}
          className={twMerge("absolute", poster.className)}
          variants={aniations}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1,
            delay: index * 0.1,
          }}
        >
          <Image
            src={poster.src}
            fill
            alt={poster.alt}
            className={twMerge("w-full h-full object-contain")}
            sizes="100%"
            priority
          />
        </motion.div>
      ))}
    </div>
  );
}
