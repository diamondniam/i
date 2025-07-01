import { HTMLMotionProps, motion } from "motion/react";
import { useRef } from "react";

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
};

export default function Text(props: TextProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div ref={ref} className="flex overflow-hidden">
      {props.text.split("").map((char, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={child}
          initial="hidden"
          transition={{
            duration: 1,
            delay: index * 0.05,
          }}
          {...props.letterArgs}
        >
          {char === " " ? "\u00A0" : char}
        </motion.div>
      ))}
    </motion.div>
  );
}
