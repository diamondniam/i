import { getRandom, useDebouncedCallback, useScrollPosition } from "@/utils";
import HeaderCircle from "@public/images/bannerCircle.svg";
import { useEffect, useRef, useState } from "react";

import {
  animate,
  AnimationOptions,
  DOMKeyframesDefinition,
  motion,
} from "motion/react";

const INITIAL_ALL_CIRCLES_ANIMATION_DELAY = 3;
const INITIAL_CIRCLE_Y = 100;
const INITIAL_DURATION = 1000;

const circlesStyles = [
  "lg:top-2/10 top-1/12 left-2/16 w-2/12",
  "lg:top-4/12 top-2/12 right-2/14 w-2/20",
  "lg:bottom-3/12 bottom-2/12 left-0 w-4/16",
  "lg:bottom-2/10 bottom-1/12 right-1/12 w-4/20",
];

export default function BannerCircles() {
  const ref = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isInitiated, setIsInitiated] = useState(false);
  const isAbleToSetY = useRef(false);
  const scrollParallaxData = useRef<number[]>([]);
  const circleRefs = useRef<HTMLDivElement[]>([]);
  const [isOut, setIsOut] = useState(false);

  const scrollPosition = useScrollPosition({
    debounceDelay: 100,
    options: { notTrailing: true },
  });

  const handleMouseMove = (e: MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMoveDebounce = useDebouncedCallback({
    callback: handleMouseMove,
    delay: 100,
    options: { notTrailing: true },
  });

  const animateCircle = (
    ref: HTMLElement,
    params: DOMKeyframesDefinition,
    transition?: AnimationOptions
  ) => {
    animate(ref, params, { duration: INITIAL_DURATION / 1000, ...transition });
  };

  const matchTransform = (circle: HTMLElement) => {
    const transform = circle.style.transform;
    const matchRotate = transform.match(/rotate\((-?\d+(\.\d+)?)deg\)/);
    const matchTranlate = transform.match(
      /translate\((-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px\)/
    );

    return {
      rotate: matchRotate ? Number(matchRotate[1]) : 0,
      translate: {
        x: matchTranlate ? Number(matchTranlate[1]) : 0,
        y: matchTranlate ? Number(matchTranlate[2]) : 0,
      },
    };
  };

  const normalizeAngle = (current: number, target: number) => {
    let delta = target - current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    return current + delta;
  };

  const getAngleToRotate = (circle: HTMLElement) => {
    if (!ref.current) throw new Error("No ref");

    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const containerBoundingRect = ref.current.getBoundingClientRect();
    const containerY = containerBoundingRect.y;

    const boundingRect = circle.getBoundingClientRect();
    const elementCenter = {
      x: boundingRect.left + boundingRect.width / 2,
      y: boundingRect.top - containerY + boundingRect.height / 2,
    };
    const windowD = {
      x: center.x - elementCenter.x,
      y: center.y - elementCenter.y,
    };

    const initialDeg = 90;

    const prevRotate = matchTransform(circle).rotate;

    const angleRad = Math.atan2(windowD.y, windowD.x);
    const angleDeg = angleRad * (180 / Math.PI);
    const correctedAngle = angleDeg + initialDeg;
    const currentRotate = normalizeAngle(prevRotate, correctedAngle);

    return currentRotate;
  };

  useEffect(() => {
    for (let i = 0; i < circlesStyles.length; i++) {
      scrollParallaxData.current.push(getRandom(0.2, 1.5, true));
    }
  }, []);

  useEffect(() => {
    if (ref.current && isInitiated && !isOut) {
      circleRefs.current.forEach((circle, index) => {
        const boundingRect = circle.getBoundingClientRect();
        const position = {
          x: boundingRect.left,
          y: boundingRect.top,
        };
        const cursorD = {
          x: position.x - cursor.x,
          y: position.y - cursor.y,
        };

        const currentTransform = matchTransform(circle as HTMLElement);
        const withCurrentScroll =
          -scrollPosition * scrollParallaxData.current[index];

        const XRange = 10 + currentTransform.translate.x;
        const YRange = 10 + currentTransform.translate.y;

        animateCircle(circleRefs.current[index] as HTMLElement, {
          y: (cursorD.y > 0 ? YRange : -YRange) + withCurrentScroll,
          x: cursorD.x > 0 ? XRange : -XRange,
          rotate: currentTransform.rotate,
        });
      });
    }
  }, [cursor]);

  useEffect(() => {
    if (scrollPosition > window.innerHeight) {
      setIsOut(true);
    } else {
      setIsOut(false);
    }

    if (ref.current && isAbleToSetY.current && !isOut) {
      circleRefs.current.forEach((circle, index) => {
        const nextY = -scrollPosition * scrollParallaxData.current[index];
        const rotate = getAngleToRotate(circle as HTMLElement);
        animateCircle(circleRefs.current[index] as HTMLElement, {
          y: nextY,
          rotate,
        });
      });
    }
  }, [scrollPosition]);

  useEffect(() => {
    if (isOut) {
      window.removeEventListener("mousemove", handleMouseMove);
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }
  }, [isOut]);

  useEffect(() => {
    if (ref.current) {
      const animationFactorRange = [
        INITIAL_ALL_CIRCLES_ANIMATION_DELAY + 1,
        INITIAL_ALL_CIRCLES_ANIMATION_DELAY + 3,
      ];
      let maxTimeoutDelay = 0;

      circleRefs.current.forEach((circle, index) => {
        const correctedAngle = getAngleToRotate(circle as HTMLElement);

        animateCircle(
          circleRefs.current[index] as HTMLElement,
          {
            y: INITIAL_CIRCLE_Y,
            rotate: correctedAngle,
          },
          { duration: 0 }
        );

        isAbleToSetY.current = true;

        const timeoutDelay =
          getRandom(animationFactorRange[0], animationFactorRange[1], true) *
          1000;

        maxTimeoutDelay = Math.max(maxTimeoutDelay, timeoutDelay);

        setTimeout(() => {
          animateCircle(circleRefs.current[index] as HTMLElement, {
            opacity: 1,
            y: 0,
            rotate: correctedAngle,
          });
        }, timeoutDelay);
      });

      setTimeout(() => {
        setIsInitiated(true);
      }, maxTimeoutDelay + INITIAL_DURATION);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMoveDebounce);
    return () => {
      window.removeEventListener("mousemove", handleMouseMoveDebounce);
    };
  }, []);

  return (
    <div ref={ref} className="absolute top-0 left-0 w-full h-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          ref={(el: HTMLDivElement) => {
            circleRefs.current[index] = el;
          }}
          initial={{
            y: INITIAL_CIRCLE_Y,
            opacity: 0,
          }}
          key={index}
          className={`absolute origin-center will-change-transform ${circlesStyles[index]}`}
        >
          <HeaderCircle />
        </motion.div>
      ))}
    </div>
  );
}
