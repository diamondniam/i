import { useEffect, useRef } from "react";
import { createHighlighter, Highlighter } from "shiki";

import kanagawaDragon from "shiki/themes/kanagawa-dragon.mjs";

export function useCodeHighlighter(
  { langs }: { langs: string[] } = { langs: ["vue", "js"] }
) {
  const highlighter = useRef<Highlighter | null>(null);

  const customTheme = {
    ...kanagawaDragon,
    name: "diamondniam",
    colors: {
      ...kanagawaDragon.colors,
      "editor.background": "transparent",
    },
  };

  useEffect(() => {
    createHighlighter({ themes: [customTheme], langs }).then((highlighter_) => {
      highlighter.current = highlighter_;
    });
  }, []);

  return highlighter;
}

export function useCodeFormatter({
  highlighter,
  code,
  setCode,
  lang,
}: {
  highlighter: Highlighter | null;
  code: string;
  setCode: (code: string) => void;
  lang: string;
}) {
  useEffect(() => {
    if (highlighter) {
      setCode(
        highlighter.codeToHtml(code, {
          lang,
          theme: "diamondniam",
        })
      );
    }
  }, [highlighter]);
}
