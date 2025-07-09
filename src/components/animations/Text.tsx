import { HTMLMotionProps, motion } from "motion/react";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

const child = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

type TextProps = {
  text: string;
  className?: string;
  letterArgs?: HTMLMotionProps<"div">;
  delay?: number;
  duration?: number;
  factor?: number;
};

const ANIMATION_FACTOR = 0.05;

export default function Text(props: TextProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={twMerge("flex overflow-hidden flex-wrap", props.className)}
    >
      {props.text.split("").map((char, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={child}
          initial="hidden"
          transition={{
            duration: props?.duration || 1,
            delay:
              index * (props.factor || ANIMATION_FACTOR) + (props.delay || 0),
          }}
          animate="visible"
          {...props.letterArgs}
        >
          {char === " " ? "\u00A0" : char}
        </motion.div>
      ))}
    </motion.div>
  );
}
