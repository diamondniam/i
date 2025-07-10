import { Hardware, Power } from "@/utils/useHardware";

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
  hardware: Hardware;
  animations: any;
  elseAnimations?: any;
  options?: { powerEnter?: Power };
};

export const useOpimizedAnimations = ({
  hardware,
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
