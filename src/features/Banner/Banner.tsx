"use client";

import { useConfig } from "@/contexts";
import BannerCircles from "@/features/Banner/BannerCircles";
import BannerTitle from "@/features/Banner/BannerTitle";
import { useOpimizedAnimations } from "@/hooks";
import BannerLaptop from "@public/images/bannerLaptop.svg";
import BannerPhone from "@public/images/bannerPhone.svg";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";

export default function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const locale = useLocale();

  const { data: configData } = useConfig();

  const statusData = configData?.find(
    (item: any) => item.id === "status"
  )?.data;

  const optimizeAnimations = useOpimizedAnimations();

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
            {...optimizeAnimations({
              animations: {
                initial: { opacity: 0, y: 200 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1, delay: 1.5 },
              },
            })}
          >
            <BannerPhone />
          </motion.div>

          <motion.div
            className="md:w-[230px] w-[200px] absolute bottom-0 left-0"
            {...optimizeAnimations({
              animations: {
                initial: { opacity: 0, y: 200 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1, delay: 1 },
              },
            })}
          >
            <BannerLaptop />
          </motion.div>
        </div>

        <BannerTitle />

        <motion.h2
          className="text-[var(--gray)] font-light text-center"
          {...optimizeAnimations({
            animations: {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 1, delay: 1.5 },
            },
          })}
        >
          {t("components.banner.description")}
        </motion.h2>
      </div>

      <AnimatePresence>
        {statusData?.id && (
          <motion.div
            className="absolute top-0 flex items-center justify-center gap-2 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="flex items-center gap-2 w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: statusData.colors[statusData.id],
              }}
            ></div>

            <p className="text-[var(--gray)] font-light text-sm">
              {statusData.translations[statusData.id][locale]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
