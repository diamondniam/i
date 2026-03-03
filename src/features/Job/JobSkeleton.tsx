import { PreloaderLine } from "@/components/ui/Preloader";
import { TimelineItem } from "@/components/ui/Timeline";
import { getRandom } from "@/utils";
import { useCallback, useEffect, useRef } from "react";
import { motion } from "motion/react";

const QUANTITY = 3;

export default function JobSkeleton() {
  const isInitiated = useRef(false);
  const jobLines = useRef<{ dateRange: string[]; lines: number }[]>([]);

  const Job = useCallback(({ jobIndex }: { jobIndex: number }) => {
    return (
      <div className="flex flex-col gap-5">
        <PreloaderLine className="h-10 max-w-[300px]" />

        <div className="flex flex-col gap-3">
          {[...Array(jobLines.current[jobIndex]?.lines || 6)].map(
            (_, index) => (
              <PreloaderLine key={index} className="h-5" />
            )
          )}
        </div>
      </div>
    );
  }, []);

  useEffect(() => {
    if (isInitiated.current) return;
    isInitiated.current = true;

    for (let i = 0; i < QUANTITY; i++) {
      jobLines.current.push({
        dateRange: [
          getRandom(3012, 3200).toString(),
          getRandom(3412, 3600).toString(),
        ],
        lines: getRandom(6, 12),
      });
    }
  }, []);

  return (
    <motion.div
      key="job-skeleton"
      className="flex flex-col gap-20"
      exit={{ opacity: 0 }}
    >
      {[...Array(QUANTITY)].map((_, index) => (
        <Job key={index} jobIndex={index} />
      ))}
    </motion.div>
  );
}
