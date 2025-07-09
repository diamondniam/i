import { PreloaderLine } from "@/components/ui/Preloader";

export default function CodeTemplateSkeleton() {
  return (
    <div className="h-[200px] gapS overflow-hidden w-[80%]">
      {[...Array(10)].map((_, index) => (
        <PreloaderLine key={index} className="flex-none bg-[var(--gray)]/20" />
      ))}
    </div>
  );
}
