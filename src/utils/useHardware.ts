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
    const currentConcurrency = navigator.hardwareConcurrency || 2;
    const windowWidth = window.innerWidth;

    if (windowWidth < 768 || currentConcurrency <= 4) {
      setPower("low");
    } else if (currentConcurrency >= 8) {
      setPower("high");
    }

    setIsSet(true);
  }, []);

  return {
    power,
    isSet,
    // concurrency,
  };
};

function FPSCheck(duration = 500): Promise<number> {
  return new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();

    function count() {
      frames++;
      const now = performance.now();
      if (now - start < duration) {
        requestAnimationFrame(count);
      } else {
        const fps: number = (frames / (now - start)) * 1000;
        // console.log(fps);
        resolve(fps);
        // if (fps >= 50) resolve("high");
        // else if (fps >= 30) resolve("medium");
        // else resolve("low");
      }
    }

    requestAnimationFrame(count);
  });
}

function cpuBenchmark(iterations = 1e6) {
  const start = performance.now();
  let sum = 0;

  for (let i = 0; i < iterations; i++) {
    sum += Math.sqrt(i * Math.random());
  }

  const duration = performance.now() - start;

  return duration;
  // if (duration < 100) return "high";
  // if (duration < 250) return "medium";
  // return "low";
}

async function getDevicePowerLevel(): Promise<Power> {
  const threads = navigator.hardwareConcurrency || 1;

  console.log(threads);

  const cpuTime = cpuBenchmark();
  const fps = await FPSCheck();

  const score = threads * 10 + (60 - Math.min(cpuTime, 300)) + fps;

  console.log(score);

  if (score > 140) return "high";
  if (score > 90) return "medium";
  return "low";
}
