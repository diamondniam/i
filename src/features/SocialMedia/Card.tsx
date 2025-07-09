import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type CardProps = {
  description: string;
  image: string;
  likes: number;
  type: "image" | "video";
  comments: number;
};

export default function Card(props: CardProps) {
  const [likes, setLikes] = useState(props.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeAnimated, setIsLikeAnimated] = useState(false);
  const [comments, setComments] = useState(props.comments);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  useEffect(() => {
    if (isLiked) {
      setIsLikeAnimated(false);
    }
  }, [isLiked]);

  return (
    <div className="w-full h-full flex flex-col gap-1 relative">
      <Image
        src={props.image}
        width={100}
        height={100}
        className="w-full rounded-lg"
        alt={props.description}
      />

      <AnimatePresence mode="wait">
        {isLiked && !isLikeAnimated && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => setIsLikeAnimated(true)}
            className="w-full h-full absolute top-0 left-0 pointer-events-none select-none"
          >
            <HeartIcon
              className="text-[var(--red)] opacity-70"
              fill="currentColor"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <motion.button
            className="flex gap-0.5 items-center text-xs text-[var(--foreground)]"
            onClick={() => handleLike()}
            animate={{ color: isLiked ? "var(--red)" : "currentColor" }}
            whileTap={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
          >
            <HeartIcon className="w-4.5 h-4.5" fill="currentColor" />
            <p>{likes}</p>
          </motion.button>

          {props.comments > 0 && (
            <motion.button
              className="flex gap-0.5 items-center text-xs text-[var(--foreground)]"
              onClick={() => setComments(comments + 1)}
              whileTap={{ scale: 1.05, y: -1 }}
              transition={{ duration: 0.1 }}
            >
              <ChatBubbleOvalLeftIcon
                className="w-4.5 h-4.5"
                fill="currentColor"
              />
              <p>{comments}</p>
            </motion.button>
          )}
        </div>

        <p className="text-[10px]">{props.description}</p>
      </div>
    </div>
  );
}
