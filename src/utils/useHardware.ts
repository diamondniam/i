import { useEffect, useState } from "react";

export type Concurrency = number | undefined;
export type Power = "low" | "medium" | "high";

export type Hardware = {
  power: Power;
  concurrency: Concurrency;
};

export const useHardware = () => {
  const [concurrency, setConcurrency] = useState<Concurrency>(undefined);
  const [power, setPower] = useState<Power>("low");

  useEffect(() => {
    const currentConcurrency = navigator.hardwareConcurrency || 2;

    // if (currentConcurrency >= 8) {
    //   setPower("high");
    // } else if (currentConcurrency > 4) {
    //   setPower("medium");
    // }

    setConcurrency(currentConcurrency);
  }, []);

  return {
    power,
    concurrency,
  };
};
