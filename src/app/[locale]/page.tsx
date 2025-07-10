"use client";

import Banner from "@/features/Banner";
import Job from "@/features/Job";
import Laboratory from "@/features/Laboratory";
import NickRoomAnimation from "@/features/NickRoomAnimation";
import { useNavigationStore } from "@/store/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Footer from "@/features/Footer";
import Header from "@/features/Header";

export default function Home() {
  const {
    previousPath,
    nickRoom,
    setNickRoomAnimating,
    setNickRoomAnimatingDir,
  } = useNavigationStore();

  useEffect(() => {
    if (previousPath?.includes("/nickroom")) {
      setTimeout(() => {
        document.body.style.background = "var(--background)";
      }, 100);

      setNickRoomAnimating(true);
      setNickRoomAnimatingDir("backwards");
    }
  }, [previousPath]);

  useEffect(() => {
    console.log(navigator.hardwareConcurrency);
  }, []);

  return (
    <div>
      <AnimatePresence initial={true} mode="wait">
        {nickRoom.isAnimating === false && (
          <motion.div
            // className="mt-[3000px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Header />
            <Banner />
            <Job />
            <Laboratory />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <NickRoomAnimation />
    </div>
  );
}
