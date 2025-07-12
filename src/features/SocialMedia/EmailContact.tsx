import Tooltip from "@/components/ui/Tooltip";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import "./style.css";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

type EmailContactProps = {
  className?: string;
};

const EMAIL = "1yungdiamond@gmail.com";

export default function EmailContact({ className }: EmailContactProps) {
  const t = useTranslations();

  const handleClick = () => {
    navigator.clipboard.writeText(EMAIL);
  };

  return (
    <Tooltip
      text={t("components.footer.socialMedia.tooltips.email.text")}
      clickText={t("components.footer.socialMedia.tooltips.email.clickText")}
    >
      <motion.button
        className={twMerge("contactButton", className)}
        whileHover={{ scale: 1.05 }}
        onClick={handleClick}
      >
        <AtSymbolIcon width={20} strokeWidth={2} className="text-indigo-400" />
      </motion.button>
    </Tooltip>
  );
}
