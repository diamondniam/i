import { getRequestConfig } from "next-intl/server";
import getFormats from "./formats";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import messages from "@/i18n/routes";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messages(locale),
    formats: getFormats(),
  };
});
