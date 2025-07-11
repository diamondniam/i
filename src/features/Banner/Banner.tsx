"use client";

import { useGlobal } from "@/contexts/GlobalContext";
import BannerCircles from "@/features/Banner/BannerCircles";
import BannerTitle from "@/features/Banner/BannerTitle";
import BannerLaptop from "@public/images/bannerLaptop.svg";
import BannerPhone from "@public/images/bannerPhone.svg";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export default function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const { hardware } = useGlobal();

  const lowEndAnimation = {
    initial: { opacity: 1 },
    animate: {},
    transition: {},
  };

  const bannerPhoneAnimation = () => {
    if (hardware.power === "high") {
      return {
        initial: { opacity: 0, y: 200 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, delay: 2.5 },
      };
    } else return lowEndAnimation;
  };

  const bannerLaptopAnimation = () => {
    if (hardware.power === "high") {
      return {
        initial: { opacity: 0, y: 200 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, delay: 2 },
      };
    } else return lowEndAnimation;
  };

  const descriptionAnimation = () => {
    if (hardware.power === "high") {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1, delay: 2.5 },
      };
    } else return lowEndAnimation;
  };

  return (
    <section
      id="banner"
      ref={containerRef}
      className="h-screen flex justify-center items-center relative will-change-transform pBody containerBody"
    >
      {/* <BannerCircles /> */}

      <div className="gapS relative top-5 flex items-center">
        <div className="absolute h-[200px] bottom-full md:w-[300px] w-[250px] overflow-hidden">
          <motion.div
            className="md:w-[115px] w-[100px] absolute bottom-0 right-0"
            initial={bannerPhoneAnimation().initial}
            animate={bannerPhoneAnimation().animate}
            transition={bannerPhoneAnimation().transition}
          >
            <BannerPhone />
          </motion.div>

          <motion.div
            className="md:w-[230px] w-[200px] absolute bottom-0 left-0"
            initial={bannerLaptopAnimation().initial}
            animate={bannerLaptopAnimation().animate}
            transition={bannerLaptopAnimation().transition}
          >
            <BannerLaptop />
          </motion.div>
        </div>

        <BannerTitle />

        <motion.h2
          className="text-[var(--gray)] font-light text-center"
          initial={descriptionAnimation().initial}
          animate={descriptionAnimation().animate}
          transition={descriptionAnimation().transition}
        >
          {t("components.banner.description")}
        </motion.h2>
      </div>
    </section>
  );
}
