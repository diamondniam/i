"use client";

import { useEffect, useRef, useState } from "react";
import header from "@public/data/header.json";

import { motion } from "motion/react";
import { useScrollPosition } from "@/utils";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/routing";

export default function Navigation() {
  const [active, setActive] = useState<string | null>(null);
  const activeBgRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollPostion = useScrollPosition({
    initial: true,
    debounceDelay: 100,
  });
  const locale = useLocale() as Locale;

  const handleClick = (id: string) => {
    setActive(id);

    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      if (section.id === id) {
        window.scrollTo({
          top: section.offsetTop - 100,
          behavior: "smooth",
        });
      }
    });
  };

  useEffect(() => {
    if (active && activeBgRef.current && buttonsRef.current[active]) {
      const button = buttonsRef.current[active];
      const bg = activeBgRef.current;
      const rect = button!.getBoundingClientRect();
      const parentRect = button!.parentElement!.getBoundingClientRect();

      bg.style.left = `${rect.left - parentRect.left}px`;
      bg.style.width = `${rect.width}px`;
      bg.style.height = `${rect.height}px`;
    }
  }, [active]);

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const bound = section.getBoundingClientRect();
      const id = section.id;

      if (bound.top < window.innerHeight / 3) {
        if (activeTimeout.current) {
          clearTimeout(activeTimeout.current);
        }

        activeTimeout.current = setTimeout(() => {
          if (id === "banner") {
            setActive(null);
          } else {
            setActive(section.id);
          }
        });
      }
    });
  }, [scrollPostion]);

  return (
    <nav className="w-fit absolute top-5 left-1/2 -translate-x-1/2">
      <div className="h-[55px] w-fit flex px-2 rounded-xl border border-white/10 bg-[var(--background)]/50 backdrop-blur-lg items-center">
        {header.map((item) => (
          <motion.button
            key={item.id}
            className="flex items-center py-2 px-3 rounded-lg relative z-10 whitespace-nowrap"
            onClick={() => handleClick(item.id)}
            ref={(el) => {
              if (el) {
                buttonsRef.current[item.id] = el;
              }
            }}
          >
            <p>{item.title[locale]}</p>
          </motion.button>
        ))}

        <div
          ref={activeBgRef}
          className="absolute z-0 rounded-lg transition-all duration-300"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            opacity: active ? 1 : 0,
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 w-full h-1 bg-white/60 blur-sm"></div>
        </div>
      </div>
    </nav>
  );
}
