import { useEffect, useRef, useState } from "react";
import { frames } from "./utils/animation";

type Props = {
  isPointerOn: boolean;
};

export default function NickRoomAnimation(props: Props) {
  const [frameIndex, setFrameIndex] = useState(0);
  const interval = useRef<NodeJS.Timeout | null>(null);

  const playAnimation = () => {
    interval.current = setInterval(() => {
      setFrameIndex((prev) => {
        if (prev === frames.length - 1) {
          if (interval.current) {
            clearInterval(interval.current);
          }
          return prev;
        } else {
          return (prev + 1) % frames.length;
        }
      });
    }, 100);
  };

  const stopAnimation = () => {
    if (interval.current) {
      clearInterval(interval.current);

      interval.current = setInterval(() => {
        setFrameIndex((prev) => {
          if (prev === 1) {
            if (interval.current) {
              clearInterval(interval.current);
            }
            return prev - 1;
          } else {
            return (prev - 1 + frames.length) % frames.length;
          }
        });
      }, 100);
    }
  };

  useEffect(() => {
    if (props.isPointerOn) {
      playAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [props.isPointerOn]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <div className="absolute w-[206%] left-[46%] -top-[9.5%] -translate-x-1/2 pointer-events-none select-none max-w-none">
        <img
          src={frames[frameIndex]}
          alt="Animation frame"
          className="absolute"
        />
      </div>
    </div>
  );
}
