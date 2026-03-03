import { useGlobal } from "@/contexts";
import { Power } from "@/hooks/useHardware";

export const noAnimations = {
  initial: undefined,
  animate: undefined,
  exit: undefined,
  transition: undefined,
  whileHover: undefined,
  whileTap: undefined,
  whileInView: undefined,
  viewport: undefined,
};

type OptimizedAnimations = {
  animations?: any;
  elseAnimations?: any;
  options?: { powerEnter?: Power };
};

export const useOpimizedAnimations = () => {
  const { hardware } = useGlobal();

  const getAnimations = ({
    animations,
    elseAnimations,
    options,
  }: OptimizedAnimations) => {
    if (hardware.power === (options?.powerEnter || "high")) {
      return animations;
    } else {
      return elseAnimations || noAnimations;
    }
  };

  return getAnimations;
};
