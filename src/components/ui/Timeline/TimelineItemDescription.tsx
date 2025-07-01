import { getBreakedText } from "@/utils/useText";
import parse, { domToReact } from "html-react-parser";
import { motion } from "motion/react";
import { useMemo } from "react";

export default function TimelineItemDescription({
  description,
}: {
  description: Record<string, string>;
}) {
  const descriptionComponentsMap: Record<string, React.ElementType> = {
    highlighted: (props: { children: React.ReactNode; color: string }) => {
      return (
        <motion.button
          className="rounded-sm px-0.5"
          initial={{
            color: "var(--foreground)",
            background: "transparent",
          }}
          whileInView={{
            color: props.color,
            backgroundColor: `${props.color}20`,
          }}
          transition={{ duration: 0.5, delay: 2 }}
          viewport={{ once: true }}
        >
          {props.children}
        </motion.button>
      );
    },
  };

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
    return parse(getBreakedText(description.en), descriptionParseOptions);
  }, [description.en]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      viewport={{ once: true }}
    >
      {getDescription}
    </motion.div>
  );
}
