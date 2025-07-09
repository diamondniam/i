import Navigation from "@/features/Header/Navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Header() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  useEffect(() => {
    const bannerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLogoVisible(true);
          } else {
            setIsLogoVisible(false);
          }
        });
      },
      { threshold: 0.8 }
    );

    const banner = document.getElementById("banner");

    if (banner) {
      bannerObserver.observe(banner);
    }

    return () => {
      if (banner) {
        bannerObserver.unobserve(banner);
      }
    };
  }, []);

  return (
    <motion.header
      ref={containerRef}
      className="sticky top-5 z-[10] containerBody"
      animate={{ opacity: isHeaderVisible ? 1 : 0 }}
    >
      <AnimatePresence>
        {isLogoVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/logo.png"
              width={100}
              height={100}
              alt="Logo"
              className="invert absolute top-8 left-0 -translate-y-1/2 max-sm:hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation />
    </motion.header>
  );
}
