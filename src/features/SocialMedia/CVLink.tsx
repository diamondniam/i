import Tooltip from "@/components/ui/Tooltip";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import "./style.css";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { useConfig } from "@/contexts";

type CVLinkProps = {
  className?: string;
};

const EMAIL = "1yungdiamond@gmail.com";
const CV_FILE_NAME = "almaz-nigmatzianov-cv-08342205";

export default function CVLink({ className }: CVLinkProps) {
  const t = useTranslations();

  const config = useConfig();
  const cvImageUrl = config.data?.find((i: any) => i.id === "cv")?.data?.url;

  const handleClick = async () => {
    const response = await fetch(cvImageUrl);

    const blob = await response.blob();
    const localBlobUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = localBlobUrl;
    anchor.download = CV_FILE_NAME;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  if (cvImageUrl) {
    return (
      <Tooltip text={t("components.footer.socialMedia.tooltips.cv.text")}>
        <motion.button
          className={twMerge("contactButton", className)}
          whileHover={{ scale: 1.05 }}
          onClick={handleClick}
        >
          <UserCircleIcon
            width={20}
            strokeWidth={2}
            className="text-shadow-amber-400"
          />
        </motion.button>
      </Tooltip>
    );
  }
}
