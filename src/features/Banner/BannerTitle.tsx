import { Text } from "@/components/animations";
import { motion } from "motion/react";

export default function BannerTitle() {
  return (
    <div className="flex flex-col text-center font-bold md:text-7xl text-6xl relative md:h-[120px] h-[100px]">
      <h1 className="z-1">
        <Text text="diamond" delay={1} />
      </h1>
      <h1 className="z-2 relative md:bottom-5 bottom-4">
        <Text text="niam" factor={0.1} delay={1.5} className="justify-center" />
      </h1>
      <motion.h1
        className="[text-shadow:_7px_5px_16px_black] text-transparent absolute bottom-6 w-full z-[1] select-none pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        niam
      </motion.h1>
    </div>
  );
}
