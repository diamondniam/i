"use client";

import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import Image from "next/image";

import { motion } from "motion/react";
import Code from "@/components/ui/Code";

import inputCodeSnippet from "@public/data/codes/input.json";
import jobs from "@public/data/jobs.json";

import aria from "@public/data/codes/aria.json";
import validations from "@public/data/codes/validations.json";
import vitest from "@public/data/codes/tests.json";
import { hexToRgba, useOpimizedAnimations } from "@/utils";

import RennordSkeleton from "@public/images/rennordDashboardSkeleton.svg";
import { useGlobal } from "@/contexts/GlobalContext";
import RennordAnimation from "@/features/RennordAnimation";
import { useRef } from "react";

export default function Job() {
  const highlightedMap = {
    aria,
    validations,
    vitest,
  };

  const { hardware } = useGlobal();
  const rennordLaptopRef = useRef<HTMLDivElement>(null);

  return (
    <section id="experience" className="pBody containerBody">
      <Timeline highlightedMap={highlightedMap}>
        {jobs.map((job, index) => (
          <TimelineItem key={job.id} {...job} index={index}>
            {job.id === "rennord" ? (
              <div>
                <div className="relative w-[80%] max-md:w-full aspect-[16/12] mx-auto my-[50px] left-[5%] max-sm:mt-[70px]">
                  <div className="absolute w-full h-full max-sm:hidden">
                    <motion.div
                      className="relative h-[40%] top-[15%] right-[15%]"
                      {...useOpimizedAnimations({
                        hardware,
                        animations: {
                          initial: { opacity: 0, x: 30 },
                          whileInView: { opacity: 1, x: 0 },
                          transition: { duration: 1, delay: 1.2 },
                          viewport: { once: true },
                        },
                      })}
                    >
                      <Image
                        src="/images/rennordProfileSkeleton.png"
                        fill
                        alt="Rennord Dashboard"
                        className="object-contain object-right"
                        priority
                        sizes="100%"
                      />
                    </motion.div>
                  </div>

                  <div className="absolute w-full h-full">
                    <motion.div
                      className="relative sm:w-[60%] sm:top-[8%] w-[83%] -top-[20%]"
                      {...useOpimizedAnimations({
                        hardware,
                        animations: {
                          initial: {
                            opacity: 0,
                            x: -30,
                            color: hexToRgba("#A75C37", 0),
                          },
                          whileInView: {
                            opacity: 1,
                            x: 0,
                            color: hexToRgba("#A75C37", 0.3),
                          },
                          transition: {
                            duration: 1,
                            delay: 1.5,
                            color: { duration: 1, delay: 3 },
                          },
                          viewport: { once: true },
                        },
                        elseAnimations: {
                          initial: {
                            color: hexToRgba("#A75C37", 0.3),
                          },
                        },
                      })}
                    >
                      <RennordSkeleton />
                    </motion.div>
                  </div>

                  {/* <div>
                  <motion.div
                    className="absolute w-[50%] h-[40%] max-md:w-[30%] max-md:h-[30%] rounded-full left-1/2 top-1/2 translate-x-[-55%] translate-y-[-50%] blur-2xl bg-[#A75C37] animate-pulse"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1, delay: 2.5 }}
                    viewport={{ once: true }}
                  ></motion.div>

                  <motion.div
                    className="absolute w-[50%] h-[30%] max-md:w-[30%] max-md:h-[25%] rotate-30 rounded-full left-1/2 top-1/2 translate-x-[-55%] translate-y-[-50%] blur-2xl bg-[#A73737] animate-pulse"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                    viewport={{ once: true }}
                  ></motion.div>
                </div> */}

                  <motion.div
                    ref={rennordLaptopRef}
                    className="relative h-full"
                    {...useOpimizedAnimations({
                      hardware,
                      animations: {
                        initial: { opacity: 0 },
                        whileInView: { opacity: 1 },
                        transition: { duration: 0.5, delay: 1 },
                        viewport: { once: true },
                      },
                    })}
                  >
                    <RennordAnimation containerRef={rennordLaptopRef} />
                  </motion.div>
                </div>

                <Code code={inputCodeSnippet} />
              </div>
            ) : null}
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
