import { CodeBracketIcon } from "@heroicons/react/24/outline";

export default function CodeHeader({ path }: { path: string }) {
  return (
    <div className="flex gap-3 text-[var(--gray)] border-b border-[var(--gray)]/20 p-3">
      <CodeBracketIcon className="w-5 flex-none" />
      <p className="truncate">{path}</p>
    </div>
  );
}
