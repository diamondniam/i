import { banner } from "@/i18n/routes/components/banner";
import { footer } from "@/i18n/routes/components/footer";
import { timeline } from "@/i18n/routes/components/timeline";
import { Locale } from "@/i18n/routing";

export const components = (locale: Locale) => ({
  timeline: timeline(locale),
  banner: banner(locale),
  footer: footer(locale),
});
