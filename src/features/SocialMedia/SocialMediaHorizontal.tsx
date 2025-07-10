import Avatar from "@/features/SocialMedia/Avatar";
import Card from "@/features/SocialMedia/Card";
import { LinkIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import "./styles.css";

import { motion, useInView } from "motion/react";

import posts from "@public/data/socialMediaPosts.json";
import { useEffect, useRef, useState } from "react";

const NICKNAME = "@diamondniam";
const LINK = "https://instagram.com/diamondniam";

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
      className={twMerge("w-full p-5 flex justify-center", className)}
    >
      <div
        ref={containerRef}
        className={twMerge(
          "flex overflow-auto w-full rounded-lg relative gap-3 removeScrollbar"
        )}
        style={{
          scrollSnapType: `${isScrolled ? "x mandatory" : "none"}`,
        }}
        onPointerEnter={() => {
          setIsScrolled(true);
        }}
      >
        <div className="flex flex-col gap-3 items-center justify-center w-[150px] flex-none snap-start">
          <motion.a
            href={LINK}
            className="flex-none w-[110px] flex items-center justify-center bg-[var(--background-secondary)]/50 backdrop-blur-sm px-2 py-[2px] rounded-full border border-[var(--gray)]/[.05] z-[1]"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-[10px] font-medium linkText text-indigo-400">
              {NICKNAME}
              <LinkIcon
                className="inline-block w-[9px] h-[9px] text-indigo-400 ml-1"
                strokeWidth={2}
              />
            </p>
          </motion.a>

          <Avatar size={90} />
        </div>

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
  );
}
