export default function CodeContent({ code }: { code: string | TrustedHTML }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: code }} data-lenis-prevent></div>
  );
}
