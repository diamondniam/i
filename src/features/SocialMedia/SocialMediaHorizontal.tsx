import Avatar from "@/features/SocialMedia/Avatar";
import Card from "@/features/SocialMedia/Card";
import { twMerge } from "tailwind-merge";
import "./style.css";

import posts from "@public/data/socialMediaPosts.json";
import { useEffect, useRef, useState } from "react";
import EmailContact from "@/features/SocialMedia/EmailContact";
import InstagramContact from "@/features/SocialMedia/InstagramContact";
import TelegramContact from "@/features/SocialMedia/TelegramContact";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import { useConfig } from "@/contexts";

export default function SocialMediaHorizontal({
  ref,
  className,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const isInView = useInView(ref, { amount: 0.8 });
  const animationFrameId = useRef<number | null>(null);

  const { data: configData } = useConfig();
  const locale = useLocale();

  const statusData = configData?.find(
    (item: any) => item.id === "status"
  )?.data;

  const scrollStep = () => {
    if (containerRef.current && !isScrolled) {
      containerRef.current.scrollLeft += 1;
      animationFrameId.current = requestAnimationFrame(scrollStep);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      if (!isScrolled && isInView) {
        scrollStep();
      } else {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isScrolled, isInView]);

  return (
    <div
      ref={ref}
      className={twMerge(
        "p-5 flex justify-center max-w-[800px] mx-auto",
        className
      )}
    >
      <div className={twMerge("flex flex-col relative gap-5 w-full")}>
        <div className="flex flex-col gap-3 items-center self-center justify-center flex-none">
          <Avatar size={90} />

          {statusData?.id && (
            <div className="flex items-center justify-center gap-2">
              <div
                className="flex items-center gap-2 w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: statusData.colors[statusData.id],
                }}
              ></div>

              <p className="text-[var(--gray)] font-light text-sm">
                {statusData.translations[statusData.id][locale]}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <InstagramContact />
            <EmailContact />
            <TelegramContact />
          </div>
        </div>

        <div
          ref={containerRef}
          className="grid gap-3 grid-rows-1 grid-flow-col overflow-auto removeScrollbar justify-items-center rounded-lg"
          style={{
            scrollSnapType: `${isScrolled ? "x mandatory" : "none"}`,
          }}
          onPointerEnter={() => {
            setIsScrolled(true);
          }}
        >
          {posts.map((item) => (
            <Card
              key={item.id}
              description={item.description}
              type={item.type as "image" | "video"}
              image={item.image}
              likes={item.likes}
              comments={item.comments}
              classNames={{ container: "w-[200px] flex-none snap-center" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
