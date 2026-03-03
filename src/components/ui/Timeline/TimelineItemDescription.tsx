import { CodeProps } from "@/components/ui/Code/types";
import TimelineItemDescriptionHighlighted from "@/components/ui/Timeline/TimelineItemDescriptionHighlighted";
import { TimelineItemDescriptionHightlightedProps } from "@/components/ui/Timeline/types";
import { useOpimizedAnimations } from "@/hooks";
import { getBreakedText } from "@/utils";
import parse, { domToReact } from "html-react-parser";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { useMemo } from "react";

export default function TimelineItemDescription({
  description,
  codes,
}: {
  codes: CodeProps[];
  description: Record<string, string>;
}) {
  const descriptionComponentsMap: Record<string, React.ElementType> = {
    highlighted: ({ ...props }: TimelineItemDescriptionHightlightedProps) =>
      TimelineItemDescriptionHighlighted({ ...props, codes }),
  };
  const locale = useLocale();
  const optimizeAnimations = useOpimizedAnimations();

  const descriptionParseOptions = {
    replace: (domNode: any) => {
      if (domNode.type === "tag" && descriptionComponentsMap[domNode.name]) {
        const Component = descriptionComponentsMap[domNode.name];

        return (
          <Component {...domNode.attribs}>
            {domToReact(domNode.children, descriptionParseOptions)}
          </Component>
        );
      }
    },
  };

  const getDescription = useMemo(() => {
    return parse(getBreakedText(description[locale]), descriptionParseOptions);
  }, [locale]);

  return (
    <motion.div
      {...optimizeAnimations({
        animations: {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          transition: { delay: 0.5, duration: 1 },
          viewport: { once: true },
        },
      })}
    >
      {getDescription}
    </motion.div>
  );
}
