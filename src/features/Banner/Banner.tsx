"use client";

import BannerCircles from "@/features/Banner/BannerCircles";
import BannerTitle from "@/features/Banner/BannerTitle";
import BannerLaptop from "@public/images/bannerLaptop.svg";
import BannerPhone from "@public/images/bannerPhone.svg";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

export default function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="banner"
      ref={containerRef}
      className="h-screen flex justify-center items-center relative will-change-transform pBody containerBody"
    >
      <BannerCircles />

      <div className="gapS relative top-5">
        <div className="absolute h-[200px] bottom-full w-full overflow-hidden">
          <motion.div
            className="md:w-[115px] w-[100px] absolute bottom-0 right-0"
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            <BannerPhone />
          </motion.div>

          <motion.div
            className="md:w-[230px] w-[200px] absolute bottom-0 left-0"
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <BannerLaptop />
          </motion.div>
        </div>

        <BannerTitle />

        <motion.h2
          className="text-[var(--gray)] font-light text-center"
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 3.5 }}
        >
          building next level user experience
        </motion.h2>
      </div>
    </section>
  );
}
