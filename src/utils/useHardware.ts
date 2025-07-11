import { useEffect, useState } from "react";

export type Concurrency = number | undefined;
export type Power = "low" | "medium" | "high";

export type Hardware = {
  power: Power;
  // concurrency: Concurrency;
  isSet: boolean;
};

export const useHardware = () => {
  // const [concurrency, setConcurrency] = useState<Concurrency>(undefined);
  const [power, setPower] = useState<Power>("low");
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    // const currentConcurrency = navigator.hardwareConcurrency || 2;

    // if (currentConcurrency >= 8) {
    //   setPower("high");
    // } else if (currentConcurrency > 4) {
    //   setPower("medium");
    // }

    FPSCheck().then((value) => {
      console.log(value);
      setPower(value as Power);
      setIsSet(true);
    });

    // setConcurrency(currentConcurrency);
  }, []);

  return {
    power,
    isSet,
    // concurrency,
  };
};

function FPSCheck(duration = 500) {
  return new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();

    function count() {
      frames++;
      const now = performance.now();
      if (now - start < duration) {
        requestAnimationFrame(count);
      } else {
        const fps = (frames / (now - start)) * 1000;
        if (fps >= 50) resolve("high");
        else if (fps >= 30) resolve("medium");
        else resolve("low");
      }
    }

    requestAnimationFrame(count);
  });
}
