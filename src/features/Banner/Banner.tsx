"use client";

import { useGlobal } from "@/contexts/GlobalContext";
import BannerCircles from "@/features/Banner/BannerCircles";
import BannerTitle from "@/features/Banner/BannerTitle";
import { useOpimizedAnimations } from "@/utils";
import BannerLaptop from "@public/images/bannerLaptop.svg";
import BannerPhone from "@public/images/bannerPhone.svg";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export default function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const { hardware } = useGlobal();

  return (
    <section
      id="banner"
      ref={containerRef}
      className="h-screen flex justify-center items-center relative pBody containerBody"
    >
      <BannerCircles />

      <div className="gapS relative top-5 flex items-center">
        <div className="absolute h-[200px] bottom-full md:w-[300px] w-[250px] overflow-hidden">
          <motion.div
            className="md:w-[115px] w-[100px] absolute bottom-0 right-0"
            {...useOpimizedAnimations({
              hardware,
              animations: {
                initial: { opacity: 0, y: 200 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1, delay: 2.5 },
              },
            })}
          >
            <BannerPhone />
          </motion.div>

          <motion.div
            className="md:w-[230px] w-[200px] absolute bottom-0 left-0"
            {...useOpimizedAnimations({
              hardware,
              animations: {
                initial: { opacity: 0, y: 200 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1, delay: 2 },
              },
            })}
          >
            <BannerLaptop />
          </motion.div>
        </div>

        <BannerTitle />

        <motion.h2
          className="text-[var(--gray)] font-light text-center"
          {...useOpimizedAnimations({
            hardware,
            animations: {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 1, delay: 2.5 },
            },
          })}
        >
          {t("components.banner.description")}
        </motion.h2>
      </div>
    </section>
  );
}
