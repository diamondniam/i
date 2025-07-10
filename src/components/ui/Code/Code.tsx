"use client";

import { CodeProps } from "@/components/ui/Code/types";
import { ChevronRightIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import CodeTemplateSkeleton from "@/components/ui/Code/CodeTemplateSkeleton";
import { motion, AnimatePresence } from "motion/react";
import { useGlobalModal } from "@/components/ui/Modal";
import { useCodeFormatter, useCodeHighlighter, useUID } from "@/utils";
import { CodeContent, CodeHeader } from "@/components/modals/Code";
import "./style.css";

export default function Code(props: { code: CodeProps }) {
  const [code, setCode] = useState("");
  const highlighter = useCodeHighlighter();
  const uid = useUID();

  useCodeFormatter({
    highlighter: highlighter.current,
    code: props.code.template,
    setCode,
    lang: props.code.lang,
  });

  const {
    currentModalId,
    setModal,
    setHeader: setModalHeader,
    setOptions: setModalOptions,
    setIsShown: setIsModalShown,
  } = useGlobalModal();

  return (
    <div className="gapS bg-[var(--background-secondary)] rounded-lg shadow-md">
      <CodeHeader path={props.code.path} />

      <div className="h-full relative">
        <div className="px-3">
          <AnimatePresence mode="wait" initial={false}>
            {code ? (
              <motion.div
                key="code"
                className="flex gap-3 px-3 overflow-hidden overflow-y-hidden max-h-[200px]"
                dangerouslySetInnerHTML={{ __html: code }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            ) : (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CodeTemplateSkeleton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hideGradient h-full w-full absolute top-0 pointer-events-none"></div>
      </div>

      <div className="border-t border-[var(--gray)]/20 p-3">
        <button
          className="group text-[var(--third)] flex items-center active:brightness-75 transition-all"
          onClick={() => {
            currentModalId.current = uid;
            setIsModalShown(true);
            setModal(<CodeContent code={code} />);
            setModalHeader(<CodeHeader path={props.code.path} />);
            setModalOptions({ mode: "full" });
          }}
        >
          More
          <ChevronRightIcon className="w-5 group-hover:md:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
}
