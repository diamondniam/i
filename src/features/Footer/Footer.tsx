"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";

import { useFooterPhone, useGlobal } from "@/contexts";
import SocialMedia, { SocialMediaHorizontal } from "@/features/SocialMedia";
import { useNavigationStore } from "@/store";

const PHONE_ANIMATION_HEIGHT = 2000;
const LAST_SCREEN_TITLES_ANIMATION_INITIAL_Y = 150;
const LAST_SCREEN_CACTUS_ANIMATION_INITIAL_Y = 20;

export default function Footer() {
  const { laboratoryRef, laboratoryPhoneRef } = useFooterPhone();

  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLImageElement>(null);
  const targetPhoneRef = useRef<HTMLImageElement>(null);
  const lastScreenRef = useRef<HTMLDivElement>(null);
  const cactusRef = useRef<HTMLButtonElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const socialMediaRef = useRef<HTMLDivElement>(null);

  const { hardware } = useGlobal();
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  const laboratoryTimeline = useRef<gsap.core.Timeline | null>(null);
  const [socialMediaScrollTrigger, setSocialMediaScrollTrigger] =
    useState(false);

  const isSimpleView = useMemo(() => {
    return isMobile || hardware.power !== "high";
  }, [isMobile, hardware.power]);

  const { setNickRoomAnimating, setNickRoomAnimatingDir } =
    useNavigationStore();

  useGSAP(
    () => {
      const laboratoryBound = laboratoryRef.current!.getBoundingClientRect();
      const laboratoryPhoneBound =
        laboratoryPhoneRef.current!.getBoundingClientRect();

      const laboratoryTimelineScrollTrigger = laboratoryRef.current;
      const laboratoryTimelineScrollStart = "top top";

      laboratoryTimeline.current = gsap.timeline({
        scrollTrigger: {
          trigger: laboratoryTimelineScrollTrigger,
          start: laboratoryTimelineScrollStart,
          end: `+=${PHONE_ANIMATION_HEIGHT}`,
          scrub: true,
          pin: true,
        },
      });

      if (!isMobile) {
        if (
          socialMediaRef.current &&
          laboratoryRef.current &&
          laboratoryPhoneRef.current &&
          laboratoryRef.current
        ) {
          ScrollTrigger.refresh();

          const laboratoryItems = Array.from(
            laboratoryRef.current!.querySelector("div")!.children
          );

          laboratoryItems.sort((a) => {
            if (a.contains(laboratoryPhoneRef.current)) return 1;
            return -1;
          });

          laboratoryItems.forEach((item, i) => {
            const isPreLast = i === laboratoryItems.length - 2;
            const isLast = i === laboratoryItems.length - 1;

            laboratoryTimeline.current!.to(item, {
              id: item.id,
              opacity: 0,
              onReverseComplete: () => {
                const el = laboratoryRef.current;

                if (el) {
                  if (isPreLast) {
                    el.classList.remove("pointer-events-none", "select-none");
                  } else if (!isLast) {
                    item.classList.remove("pointer-events-none", "select-none");
                  }
                }
              },
              onComplete: () => {
                const el = laboratoryRef.current;

                if (el) {
                  if (isPreLast) {
                    el.classList.add("pointer-events-none", "select-none");
                  } else if (!isLast) {
                    item.classList.add("pointer-events-none", "select-none");
                  }
                }
              },
            });
          });

          const targetPhoneBound =
            targetPhoneRef.current!.getBoundingClientRect();
          const lastScreenBound =
            lastScreenRef.current!.getBoundingClientRect();

          const phoneXInit = laboratoryPhoneBound.left;
          const phoneXTarget = targetPhoneBound.left;

          const phoneYInit = laboratoryPhoneBound.top - laboratoryBound.top;
          const phoneYTarget = targetPhoneBound.top - lastScreenBound.top;

          laboratoryTimeline.current.fromTo(
            phoneRef.current,
            {
              x: phoneXInit,
              y: phoneYInit,
              opacity: 0,
            },
            {
              opacity: 1,
            },
            "<"
          );

          laboratoryTimeline.current.to(
            laboratoryRef.current!.querySelector("div"),
            {
              opacity: 0,
            }
          );

          laboratoryTimeline.current.to(phoneRef.current, {
            x: phoneXTarget,
            y: phoneYTarget,
            duration: 2,
            onReverseComplete: () => {
              const phoneEl = phoneRef.current;
              const socialMediaEl = laboratoryRef.current;

              if (phoneEl && socialMediaEl) {
                phoneEl.classList.add("pointer-events-none", "select-none");
                socialMediaEl.classList.add(
                  "pointer-events-none",
                  "select-none"
                );
              }
            },
            onComplete: () => {
              const phoneEl = phoneRef.current;
              const socialMediaEl = laboratoryRef.current;

              if (phoneEl && socialMediaEl) {
                phoneEl.classList.remove("pointer-events-none", "select-none");
                socialMediaEl.classList.remove(
                  "pointer-events-none",
                  "select-none"
                );
              }
            },
          });

          laboratoryTimeline.current.to(
            socialMediaRef.current,
            {
              opacity: 1,
              onComplete: () => {
                setSocialMediaScrollTrigger(true);
              },
              onReverseComplete: () => {
                setSocialMediaScrollTrigger(false);
              },
            },
            "<"
          );

          const lastScreenItems = [cactusRef.current, titlesRef.current];

          for (let i = 0; i < lastScreenItems.length; i++) {
            const element = lastScreenItems[i];

            gsap.to(element, {
              opacity: 1,
              y: 0,
              duration: 1,
              delay: i * 2 + 1,
              scrollTrigger: {
                trigger: laboratoryRef.current,
                start: "top top",
                end: `+=${PHONE_ANIMATION_HEIGHT}`,
                scrub: 4 * i + 4,
              },
            });
          }
        }
      } else {
        ScrollTrigger.getAll().forEach((st) => st.kill(true));
        cactusRef.current!.style.opacity = "1";
        cactusRef.current!.style.transform = "none";
        titlesRef.current!.style.opacity = "1";
        titlesRef.current!.style.transform = "none";
      }
    },
    { scope: containerRef, dependencies: [isMobile] }
  );

  const handleCactusClick = () => {
    setNickRoomAnimatingDir("forward");
    setNickRoomAnimating(true);
  };

  return (
    <div
      ref={containerRef}
      className={twMerge("relative flex items-end justify-center")}
    >
      <div
        ref={phoneRef}
        className="fixed w-[200px] h-[422px] left-0 top-0 opacity-0 pointer-events-none select-none z-[1000] rounded-[35px] overflow-hidden bg-black/50"
      >
        <Image
          src="/images/appleLogo.png"
          width={40}
          height={40}
          alt="Logo Phone"
          className="object-cover absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 pointer-events-none select-none"
        />

        <Image
          src="/images/laboratoryAppleAnimationScreenEmpty.png"
          fill
          alt="Footer Phone"
          className="object-cover pointer-events-none select-none z-[1]"
          sizes="100%"
        />

        {!isSimpleView && (
          <SocialMedia
            ref={socialMediaRef}
            scrollTrigger={socialMediaScrollTrigger}
            className="opacity-0"
          />
        )}
      </div>

      <div
        ref={lastScreenRef}
        className={twMerge(
          "relative w-full flex justify-center items-center lg:gap-5 gap-3 flex-col",
          `${!isSimpleView ? "min-h-screen" : "mb-[100px] max-sm:mb-[50px]"}`
        )}
      >
        <div
          className={twMerge(
            "flex justify-center items-center lg:gap-10 gap-3 w-full",
            !isSimpleView ? "max-lg:flex-col" : "flex-col"
          )}
        >
          <div
            ref={targetPhoneRef}
            className="relative overflow-hidden"
            style={{
              opacity: isSimpleView ? 1 : 0,
              width: !isSimpleView ? "200px" : "100%",
              height: !isSimpleView ? "422px" : "",
              borderRadius: !isSimpleView ? "35px" : "",
              marginTop: !isSimpleView ? "0" : "50px",
            }}
          >
            {isSimpleView && <SocialMediaHorizontal ref={socialMediaRef} />}
          </div>

          <div
            ref={titlesRef}
            className={twMerge(`${!isSimpleView && "max-sm:mt-20"}`)}
            style={{
              transform: isSimpleView
                ? "translateY(0)"
                : `translateY(${LAST_SCREEN_TITLES_ANIMATION_INITIAL_Y}px)`,
              opacity: isSimpleView ? 1 : 0,
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
            `${!isSimpleView ? "max-[376px]:hidden" : ""} !cursor-help`
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1.05, y: -2 }}
          style={{
            transform: isSimpleView
              ? "translateY(0)"
              : `translateY(${LAST_SCREEN_CACTUS_ANIMATION_INITIAL_Y}px)`,
            opacity: isSimpleView ? 1 : 0,
          }}
          onClick={handleCactusClick}
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
