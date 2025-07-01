import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import jobs from "@public/data/jobs.json";

export default function Home() {
  return (
    <div className="my-[500px] !mt-[1000px]">
      <Timeline items={jobs} />
    </div>
  );
}
