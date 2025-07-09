"use client";

import { useFooterPhone } from "@/contexts";
import {
  AppleAnimation,
  NickRoom,
  ScheduledMuter,
} from "@/features/Laboratory/Items";

export default function Laboratory() {
  const { laboratoryRef } = useFooterPhone();

  return (
    <section
      id="laboratory"
      ref={laboratoryRef as React.RefObject<HTMLDivElement>}
      className="min-h-screen flex items-center justify-center pBody max-lg:mt-[var(--laboratory-lg-margin-top)] overflow-hidden w-full z-[1] scroll-mt-20"
    >
      <div className="grid grid-cols-2 lg:grid-rows-2 max-lg:grid-cols-1 gap-3 max-lg:gap-10 min-lg:bg-[var(--background-secondary)] w-full rounded-lg p-3 containerBody">
        <NickRoom />
        <AppleAnimation />
        <ScheduledMuter />
      </div>
    </section>
  );
}
