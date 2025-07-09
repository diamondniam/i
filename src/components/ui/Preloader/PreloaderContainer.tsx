export const animatedPreloaderLineId = "animated-preloader-line";

export default function PreloaderContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex items-center justify-center">{children}</div>;
}
