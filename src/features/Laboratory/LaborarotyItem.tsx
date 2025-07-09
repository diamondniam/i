import { Text } from "@/components/animations";
import { LaboratoryItemProps } from "@/features/Laboratory/types";
import { getRandom } from "@/utils";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

export default function LaboratoryItem(props: LaboratoryItemProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(props.refs?.container || containerRef, {
    once: true,
  });

  return (
    <div
      ref={(el: HTMLDivElement | null) => {
        if (el && props.refs && props.refs.container) {
          props.refs["container"].current = el;
        } else {
          containerRef.current = el;
        }
      }}
      className={twMerge(
        `flex justify-center gap-3 w-full h-full max-lg:flex-col-reverse max-lg:items-center`,
        props.classNames?.container
      )}
    >
      <motion.div
        className={twMerge("min-h-[200px]", props.classNames?.children)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        viewport={{ once: true }}
      >
        {props.children}
      </motion.div>

      <motion.div
        className="w-full max-lg:text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="textL">{props.title}</h3>

        <motion.p
          className="text-[var(--gray)] overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
        >
          {props.description}
        </motion.p>
      </motion.div>
    </div>
  );
}
