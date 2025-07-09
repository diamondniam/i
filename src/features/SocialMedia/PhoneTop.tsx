import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";

type PhoneTopProps = {
  className?: string;
  style?: React.CSSProperties;
  height: number;
};

export default function PhoneTop(props: PhoneTopProps) {
  const [date, setDate] = useState(new Date());
  const format = useFormatter();

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="bg-[var(--background)] flex items-center px-6 justify-between"
      style={{ height: `${props.height}px` }}
    >
      <p className="text-[8px] font-medium">{format.dateTime(date, "time")}</p>

      <div className="flex gap-1 mr-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-1 h-1 bg-[var(--background-secondary)] rounded-full"
          ></div>
        ))}
      </div>
    </div>
  );
}
