import Avatar from "@/features/SocialMedia/Avatar";
import Card from "@/features/SocialMedia/Card";
import PhoneTop from "@/features/SocialMedia/PhoneTop";
import { twMerge } from "tailwind-merge";
import "./style.css";

import posts from "@public/data/socialMediaPosts.json";
import { useEffect, useRef } from "react";
import InstagramContact from "@/features/SocialMedia/InstagramContact";
import TelegramContact from "@/features/SocialMedia/TelegramContact";
import EmailContact from "@/features/SocialMedia/EmailContact";

const IPHONE_TOP_HEIGHT = 30;
const IPHONE_BOTTOM_HEIGHT = 30;
const IPHONE_HEIGHT = 401;
const IPHONE_SCREEN_WIDTH = 10;
const NICKNAME = "@diamondniam";
const LINK = "https://instagram.com/diamondniam";

export default function SocialMedia({
  ref,
  className,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isScrolled = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  const scrollStep = () => {
    if (containerRef.current && !isScrolled.current) {
      containerRef.current.scrollTop += 1;
      animationFrameId.current = requestAnimationFrame(scrollStep);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      if (!isScrolled.current) {
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
  }, [isScrolled]);

  return (
    <div
      ref={ref}
      style={{ marginTop: `${IPHONE_SCREEN_WIDTH}px` }}
      className={twMerge("", className)}
    >
      <PhoneTop height={IPHONE_TOP_HEIGHT} />

      <div
        ref={containerRef}
        data-lenis-prevent
        className={twMerge(
          "w-[calc(100%_-_15px)] mx-auto overflow-auto relative bg-[var(--background)] p-1 flex flex-col gap-3 items-center removeScrollbar"
        )}
        style={{
          height: `calc(${IPHONE_HEIGHT}px - ${IPHONE_TOP_HEIGHT}px)`,
          paddingBottom: `${IPHONE_BOTTOM_HEIGHT}px`,
        }}
        onPointerEnter={() => {
          isScrolled.current = true;
        }}
      >
        <Avatar />

        <div className="sticky top-0 flex gap-1 z-[1]">
          <InstagramContact className="!w-[30px] !h-[30px]" />
          <EmailContact className="!w-[30px] !h-[30px]" />
          <TelegramContact className="!w-[30px] !h-[30px]" />
        </div>

        <div className="flex flex-col w-full gap-3">
          {posts.map((item) => (
            <Card
              key={item.id}
              description={item.description}
              type={item.type as "image" | "video"}
              image={item.image}
              likes={item.likes}
              comments={item.comments}
            />
          ))}
        </div>
      </div>

      <div className="bg-white/40 h-[3px] w-[40%] rounded-full absolute bottom-4 left-1/2 -translate-x-1/2"></div>
    </div>
  );
}
