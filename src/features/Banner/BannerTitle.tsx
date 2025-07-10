import { Text } from "@/components/animations";
import { useGlobal } from "@/contexts/GlobalContext";
import { useHardware } from "@/utils";
import { motion } from "motion/react";

export default function BannerTitle() {
  const { hardware } = useGlobal();

  const ghostAnimation = () => {
    if (hardware.power === "high") {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1, delay: 2.5 },
      };
    } else {
      return {
        initial: { opacity: 1 },
        animate: {},
        transition: {},
      };
    }
  };

  return (
    <div className="flex flex-col text-center font-bold md:text-7xl text-6xl relative md:h-[120px] h-[100px]">
      <h1 className="z-1">
        {hardware.power === "high" ? (
          <Text text="diamond" delay={2} />
        ) : (
          "diamond"
        )}
      </h1>

      <h1 className="z-2 relative md:bottom-5 bottom-4">
        {hardware.power === "high" ? (
          <Text text="niam" factor={0.1} delay={2} className="justify-center" />
        ) : (
          "niam"
        )}
      </h1>

      <motion.h1
        className="[text-shadow:_7px_5px_16px_black] text-transparent absolute bottom-6 w-full z-[1] select-none pointer-events-none"
        initial={ghostAnimation().initial}
        animate={ghostAnimation().animate}
        transition={ghostAnimation().transition}
      >
        niam
      </motion.h1>
    </div>
  );
}
