import { motion } from "motion/react";
import TelegramIcon from "@public/images/telegramLogo.svg";
import Tooltip from "@/components/ui/Tooltip";
import "./style.css";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

type TelegramContactProps = {
  className?: string;
};

const LINK = "https://www.t.me/diamondniam";

export default function TelegramContact({ className }: TelegramContactProps) {
  const t = useTranslations();

  return (
    <Tooltip text={t("components.footer.socialMedia.tooltips.telegram.text")}>
      <motion.a
        href={LINK}
        target="_blank"
        className={twMerge("contactButton", className)}
        whileHover={{ scale: 1.05 }}
      >
        <TelegramIcon width={16} className="text-blue-400" />
      </motion.a>
    </Tooltip>
  );
}
