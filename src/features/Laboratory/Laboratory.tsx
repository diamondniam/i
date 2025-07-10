"use client";

import { useFooterPhone } from "@/contexts";
import { useGlobal } from "@/contexts/GlobalContext";
import {
  AppleAnimation,
  NickRoom,
  ScheduledMuter,
} from "@/features/Laboratory/Items";
import { twMerge } from "tailwind-merge";

export default function Laboratory() {
  const { laboratoryRef } = useFooterPhone();
  const { hardware } = useGlobal();

  return (
    <section
      id="laboratory"
      ref={laboratoryRef as React.RefObject<HTMLDivElement>}
      className={twMerge(
        "flex items-center justify-center pBody overflow-hidden w-full z-[1]",
        `${hardware.power === "high" ? "min-h-screen max-lg:mt-[var(--laboratory-lg-margin-top)]" : "my-[100px]"}`
      )}
    >
      <div className="grid grid-cols-2 lg:grid-rows-2 max-lg:grid-cols-1 gap-3 max-lg:gap-10 min-lg:bg-[var(--background-secondary)] w-full rounded-lg p-3 containerBody">
        <NickRoom />
        <AppleAnimation />
        <ScheduledMuter />
      </div>
    </section>
  );
}
