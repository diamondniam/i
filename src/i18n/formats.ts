import { DateTimeFormatOptions, NumberFormatOptions } from "next-intl";

export default function getFormats() {
  return {
    dateTime: {
      short: {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
      time: {
        hour: "numeric",
        minute: "numeric",
      },
    } as Record<string, DateTimeFormatOptions>,
    number: {
      precise: {
        maximumFractionDigits: 5,
      },
      currency: {
        style: "currency",
        currency: "USD",
      },
    } as Record<string, NumberFormatOptions>,
    list: {
      enumeration: {
        style: "long",
        type: "conjunction",
      },
    } as Record<string, Intl.ListFormatOptions>,
  };
}
