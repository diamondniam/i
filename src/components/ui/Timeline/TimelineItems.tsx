import { useProvider } from "@/components/ui/Timeline/Provider";
import { motion } from "motion/react";

export default function TimelineItems({
  children,
}: {
  children: React.ReactNode;
}) {
  const { containerRef, TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT } =
    useProvider();

  return (
    <div
      ref={containerRef}
      className="gapL"
      style={{
        width: `calc(100% - ${TIMELINE_INITIAL_TRANSFORM_ANIMATION_AMOUNT}px)`,
      }}
    >
      {children}
    </div>
  );
}
