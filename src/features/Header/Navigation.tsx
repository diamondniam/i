"use client";

import { useEffect, useRef, useState } from "react";
import header from "@public/data/header.json";

import { motion } from "motion/react";

export default function Navigation() {
  const [active, setActive] = useState<string | null>(null);
  const activeBgRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeTimeout = useRef<NodeJS.Timeout | null>(null);

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
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          const id = visibleEntry.target.id;

          if (activeTimeout.current) {
            clearTimeout(activeTimeout.current);
          }

          activeTimeout.current = setTimeout(() => {
            console.log(id);
            if (id === "banner") {
              setActive(null);
            } else {
              setActive(id);
            }
          }, 500);
        }
      },
      {
        threshold: 0.8,
      }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (activeTimeout.current) {
        clearTimeout(activeTimeout.current);
      }
    };
  }, []);

  return (
    <nav className="w-fit relative mx-auto">
      <div className="h-[55px] w-fit flex px-2 rounded-xl border border-white/10 bg-[var(--background)]/50 backdrop-blur-lg items-center relative">
        {header.map((item) => (
          <motion.button
            key={item.id}
            className="flex items-center py-2 px-3 rounded-lg relative z-10"
            onClick={() => handleClick(item.id)}
            ref={(el) => {
              if (el) {
                buttonsRef.current[item.id] = el;
              }
            }}
          >
            <p>{item.title.en}</p>
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
