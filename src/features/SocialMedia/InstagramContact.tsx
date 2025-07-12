import { motion } from "motion/react";
import InstagramIcon from "@public/images/instagramLogo.svg";
import Tooltip from "@/components/ui/Tooltip";
import "./style.css";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

type InstagramContactProps = {
  className?: string;
};

const LINK = "https://instagram.com/diamondniam";

export default function InstagramContact({ className }: InstagramContactProps) {
  const t = useTranslations();

  return (
    <Tooltip text={t("components.footer.socialMedia.tooltips.instagram.text")}>
      <motion.a
        href={LINK}
        target="_blank"
        className={twMerge("contactButton", className)}
        whileHover={{ scale: 1.05 }}
      >
        <InstagramIcon width={18} className="text-fuchsia-400" />
      </motion.a>
    </Tooltip>
  );
}
