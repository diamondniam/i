"use client";

import { useFooterPhone } from "@/contexts";
import SocialMedia, { SocialMediaHorizontal } from "@/features/SocialMedia";
import { useDebouncedCallback, useResize, useScrollPosition } from "@/utils";
import { animate } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { useNavigationStore } from "@/store";
import { useGlobal } from "@/contexts/GlobalContext";

const LABORATORY_ITEMS_ANIMATION_HEIGHT = 500;
const LABORATORY_CONTAINER_ANIMATION_HEIGHT = 200;
const PHONE_ANIMATION_HEIGHT = 500;
const LAST_SCREEN_ANIMATION_HEIGHT = 250;
const LAST_SCREEN_TITLES_ANIMATION_INITIAL_Y = 150;
const LAST_SCREEN_CACTUS_ANIMATION_INITIAL_Y = 20;
const FOOTER_HEIGHT =
  LABORATORY_ITEMS_ANIMATION_HEIGHT +
  LABORATORY_CONTAINER_ANIMATION_HEIGHT +
  PHONE_ANIMATION_HEIGHT +
  LAST_SCREEN_ANIMATION_HEIGHT;

export default function Footer() {
  const { laboratoryRef, laboratoryPhoneRef } = useFooterPhone();
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLImageElement>(null);
  const targetPhoneRef = useRef<HTMLImageElement>(null);
  const lastScreenRef = useRef<HTMLDivElement>(null);
  const cactusRef = useRef<HTMLButtonElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const socialMediaRef = useRef<HTMLDivElement>(null);
  const laboratoryFixedOn = useRef(-1);
  const scrollPosition = useScrollPosition({ initial: true });
  const laboratoryItemsProps = useRef<{ offset: number; speed: number }[]>([]);
  const lastScreenItemsProps = useRef<{ offset: number; speed: number }[]>([]);
  const size = useResize();
  const [footerSize, setFooterSize] = useState("0px");
  const { hardware } = useGlobal();

  const { setNickRoomAnimating, setNickRoomAnimatingDir } =
    useNavigationStore();

  const clamp = (value: number, min = 0, max = 1) => {
    return Math.min(Math.max(value, min), max);
  };

  const getAnimationItemsProps = (items: HTMLElement[]) => {
    return Array.from(items, (_, i) => {
      const offset = Math.random() * 0.4 - 0.2;
      const speed = 1 + Math.random() * 0.5;
      return { offset, speed };
    });
  };

  const getAnimatedProgresses = (
    itemsWithProps: { offset: number; speed: number }[],
    progress: number
  ) => {
    const animatedProgresses = itemsWithProps.map((item) => {
      return clamp(progress * item.speed + item.offset);
    });

    return animatedProgresses;
  };

  const handleCactusClick = () => {
    setNickRoomAnimatingDir("forward");
    setNickRoomAnimating(true);
  };

  const getFooterSize = () => {
    if (
      containerRef.current &&
      laboratoryRef.current &&
      laboratoryPhoneRef.current &&
      hardware.power === "high"
    ) {
      const laboratoryBound = laboratoryRef.current.getBoundingClientRect();
      const laboratoryPhoneBound =
        laboratoryPhoneRef.current.getBoundingClientRect();
      const fixedPhoneTop =
        (laboratoryBound.top - laboratoryPhoneBound.top) * -1;
      const laboratoryHeightAndPositionAmount =
        fixedPhoneTop + laboratoryBound.height / 2 + window.innerHeight / 2;
      const possibleMargin = 100;
      const laboratoryHeight =
        laboratoryHeightAndPositionAmount + possibleMargin;

      setFooterSize(`${laboratoryHeight + FOOTER_HEIGHT}px`);
    } else {
      setFooterSize("100%");
    }
  };

  const getFooterSizeDebounced = useDebouncedCallback({
    callback: getFooterSize,
    delay: 300,
  });

  const animateLaboratory = () => {
    const laboratoryItems =
      laboratoryRef.current?.querySelector("div")?.children;

    if (
      !laboratoryItems ||
      !laboratoryRef.current ||
      !containerRef.current ||
      !phoneRef.current ||
      !laboratoryPhoneRef.current ||
      !targetPhoneRef.current ||
      !lastScreenRef.current ||
      !cactusRef.current ||
      !titlesRef.current ||
      !socialMediaRef.current
    )
      return;

    const containerBound = containerRef.current.getBoundingClientRect();
    const laboratoryBound = laboratoryRef.current?.getBoundingClientRect();
    const laboratoryPhoneBound =
      laboratoryPhoneRef.current.getBoundingClientRect();
    let itemsDistanceScrolled =
      Math.max(containerBound.top * -1, 0) -
      Math.max(laboratoryBound.top * -1, 0);

    if (window.innerWidth < 1024) {
      const laboratoryLgMarginTop = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--laboratory-lg-margin-top")
          .trim()
          .replace("px", "")
      );

      itemsDistanceScrolled -= laboratoryLgMarginTop;
    }

    // LAB ITEMS

    const itemsProgress = Math.min(
      Math.max(itemsDistanceScrolled / LABORATORY_ITEMS_ANIMATION_HEIGHT, 0),
      1
    );

    const itemsProgresses = getAnimatedProgresses(
      laboratoryItemsProps.current,
      itemsProgress
    );

    const navigation = document.querySelector("nav")?.querySelector("div");

    if (itemsProgress > 0.1) {
      animate(laboratoryRef.current, { zIndex: -1 }, { duration: 0 });
    } else {
      animate(laboratoryRef.current, { zIndex: 1 }, { duration: 0 });
    }

    for (let i = 0; i < laboratoryItems.length; i++) {
      const element = laboratoryItems[i];

      animate(element, { opacity: 1 - itemsProgresses[i] }, { duration: 0 });
    }

    animate(
      phoneRef.current,
      { y: laboratoryPhoneBound.top, x: laboratoryPhoneBound.left },
      { duration: 0 }
    );

    if (navigation) {
      animate(navigation, { opacity: 1 - itemsProgress }, { duration: 0 });
    }

    // FOOTER PHONE
    animate(phoneRef.current, { opacity: itemsProgress }, { duration: 0 });

    // LAB CONTAINER

    const containerDistanceScrolled =
      itemsDistanceScrolled - LABORATORY_ITEMS_ANIMATION_HEIGHT;

    const containerProgress = Math.min(
      Math.max(
        containerDistanceScrolled / LABORATORY_CONTAINER_ANIMATION_HEIGHT,
        0
      ),
      1
    );

    animate(
      laboratoryRef.current,
      { opacity: 1 - containerProgress },
      { duration: 0 }
    );

    // PHONE

    const phoneDistanceScrolled =
      itemsDistanceScrolled -
      LABORATORY_ITEMS_ANIMATION_HEIGHT -
      LABORATORY_CONTAINER_ANIMATION_HEIGHT;

    const phoneProgress = Math.min(
      Math.max(phoneDistanceScrolled / PHONE_ANIMATION_HEIGHT, 0),
      1
    );

    const targetPhoneBound = targetPhoneRef.current.getBoundingClientRect();
    const lastScreenBound = lastScreenRef.current.getBoundingClientRect();
    const phoneX =
      laboratoryPhoneBound.left -
      phoneProgress * (laboratoryPhoneBound.left - targetPhoneBound.left);

    const phoneYTarget =
      laboratoryPhoneBound.top + lastScreenBound.top - targetPhoneBound.top;
    const phoneY = laboratoryPhoneBound.top - phoneProgress * phoneYTarget;

    animate(phoneRef.current, { x: phoneX, y: phoneY }, { duration: 0 });

    animate(
      socialMediaRef.current,
      { opacity: phoneProgress },
      {
        duration: 0,
      }
    );

    if (phoneProgress === 1) {
      phoneRef.current.classList.remove("pointer-events-none", "select-none");
    } else {
      phoneRef.current.classList.add("pointer-events-none", "select-none");
    }

    // LAST SCREEN

    const lastScreenDistanceScrolled =
      itemsDistanceScrolled -
      LABORATORY_ITEMS_ANIMATION_HEIGHT -
      LABORATORY_CONTAINER_ANIMATION_HEIGHT -
      PHONE_ANIMATION_HEIGHT;

    const lastScreenItems = [cactusRef.current, titlesRef.current];

    const lastScreenProgress = Math.min(
      Math.max(lastScreenDistanceScrolled / LAST_SCREEN_ANIMATION_HEIGHT, 0),
      1
    );

    const lastScreenItemsProgresses = getAnimatedProgresses(
      lastScreenItemsProps.current,
      lastScreenProgress
    );

    for (let i = 0; i < lastScreenItems.length; i++) {
      const element = lastScreenItems[i];
      const currentProgress = lastScreenItemsProgresses[i];
      const initialY =
        element === cactusRef.current
          ? LAST_SCREEN_CACTUS_ANIMATION_INITIAL_Y
          : LAST_SCREEN_TITLES_ANIMATION_INITIAL_Y;
      const currentY = initialY - currentProgress * initialY;

      animate(
        element,
        { opacity: currentProgress, y: currentY },
        { duration: 0 }
      );
    }

    if (lastScreenProgress === 0) {
      for (let i = 0; i < lastScreenItems.length; i++) {
        const element = lastScreenItems[i];
        animate(element, { opacity: 0 }, { duration: 0 });
      }
    } else if (lastScreenProgress === 1) {
      for (let i = 0; i < lastScreenItems.length; i++) {
        const element = lastScreenItems[i];
        animate(element, { opacity: 1, y: 0 }, { duration: 0.3 });
      }
    }
  };

  useEffect(() => {
    const laboratoryItems =
      laboratoryRef.current?.querySelector("div")?.children;

    if (laboratoryItems) {
      laboratoryItemsProps.current = getAnimationItemsProps(
        Array.from(laboratoryItems) as HTMLElement[]
      );
    }

    if (cactusRef.current && titlesRef.current) {
      lastScreenItemsProps.current = getAnimationItemsProps([
        cactusRef.current,
        titlesRef.current,
      ] as HTMLElement[]);
    }

    if (hardware.power !== "high") {
      getFooterSize();
    }
  }, []);

  useEffect(() => {
    if (
      scrollPosition !== 0 &&
      laboratoryRef.current &&
      containerRef.current &&
      laboratoryPhoneRef.current &&
      hardware.power === "high"
    ) {
      getFooterSizeDebounced();
      animateLaboratory();

      const laboratoryPhoneBound =
        laboratoryPhoneRef.current.getBoundingClientRect();

      if (laboratoryFixedOn.current !== -1) {
        if (scrollPosition < laboratoryFixedOn.current) {
          laboratoryRef.current.style.position = "static";
          laboratoryRef.current.classList.add("overflow-hidden");
          laboratoryFixedOn.current = -1;
          laboratoryRef.current.style.transform = "translateY(0)";
        }

        return;
      }

      const windowHeight = window.innerHeight;
      const laboratoryPhoneCenter =
        laboratoryPhoneBound.height / 2 + laboratoryPhoneBound.top;

      if (laboratoryPhoneCenter <= windowHeight / 2) {
        laboratoryRef.current.classList.remove("overflow-hidden");
        laboratoryRef.current.style.position = "fixed";
        laboratoryRef.current.style.top = "0px";
        const laboratoryPhoneBoundNext =
          laboratoryPhoneRef.current!.getBoundingClientRect();
        const laboratoryPhoneCenterNext =
          laboratoryPhoneBoundNext.height / 2 + laboratoryPhoneBoundNext.top;
        laboratoryRef.current.style.transform = `translateY(${(laboratoryPhoneCenterNext - windowHeight / 2) * -1}px)`;
        const laboratoryFixedOnValue =
          scrollPosition - laboratoryPhoneCenter * -1 - windowHeight / 2;
        laboratoryFixedOn.current = laboratoryFixedOnValue;
      }
    }
  }, [scrollPosition, size]);

  return (
    <div
      ref={containerRef}
      className={twMerge("flex items-end justify-center relative")}
      style={{
        height: `${footerSize}`,
      }}
    >
      <div
        ref={phoneRef}
        className="fixed w-[200px] h-[422px] left-0 top-0 opacity-0 pointer-events-none select-none z-[1] rounded-[35px] overflow-hidden bg-black/50 will-change-transform"
      >
        <Image
          src="/images/logoStone.png"
          width={60}
          height={50}
          alt="Logo Phone"
          className="object-cover absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 pointer-events-none select-none"
        />

        <Image
          src="/images/laboratoryAppleAnimationScreenEmpty.png"
          fill
          alt="Footer Phone"
          className="object-cover pointer-events-none select-none z-[1]"
        />

        <SocialMedia ref={socialMediaRef} className="opacity-0" />
      </div>

      <div
        ref={lastScreenRef}
        className={twMerge(
          "w-full flex justify-center items-center md:gap-5 gap-3 flex-col relative",
          `${hardware.power === "high" ? "min-h-screen" : "mb-[100px] max-sm:mb-[50px]"}`
        )}
      >
        <div
          className={twMerge(
            "flex justify-center items-center md:gap-10 gap-3 w-full",
            hardware.power === "high" ? "max-md:flex-col" : "flex-col"
          )}
        >
          <div
            ref={targetPhoneRef}
            className="relative overflow-hidden"
            style={{
              opacity: hardware.power !== "high" ? 1 : 0,
              width: hardware.power === "high" ? "200px" : "100%",
              height: hardware.power === "high" ? "422px" : "",
              borderRadius: hardware.power === "high" ? "35px" : "",
              marginTop: hardware.power === "high" ? "0" : "50px",
            }}
          >
            {hardware.power !== "high" && (
              <SocialMediaHorizontal ref={socialMediaRef} />
            )}
          </div>

          <div
            ref={titlesRef}
            className={twMerge(
              "max-[321px]:hidden will-change-opacity",
              `${hardware.power === "high" && "max-sm:mt-20"}`
            )}
            style={{
              transform:
                hardware.power !== "high"
                  ? "translateY(0)"
                  : `translateY(${LAST_SCREEN_TITLES_ANIMATION_INITIAL_Y}px)`,
              opacity: hardware.power !== "high" ? 1 : 0,
            }}
          >
            <Image
              src="/images/footerTitles.png"
              width={300}
              height={50}
              alt="Footer Titles"
              className="max-sm:w-[220px]"
            />
          </div>
        </div>

        <motion.button
          ref={cactusRef}
          className={twMerge(
            "will-change-opacity",
            `${hardware.power === "high" && "max-[376px]:hidden"}`
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1.05, y: -2 }}
          style={{
            transform:
              hardware.power !== "high"
                ? "translateY(0)"
                : `translateY(${LAST_SCREEN_CACTUS_ANIMATION_INITIAL_Y}px)`,
            opacity: hardware.power !== "high" ? 1 : 0,
          }}
          onClick={() => handleCactusClick()}
        >
          <Image
            src="/images/footerCactus.png"
            alt="Footer Cactus"
            width={120}
            height={30}
          />
        </motion.button>
      </div>
    </div>
  );
}
