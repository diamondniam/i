import { Locale } from "@/i18n/routing";
import en from "@public/locales/en/components/timeline.json";
import ru from "@public/locales/ru/components/timeline.json";

export const timeline = (locale: Locale) => ({ en, ru })[locale];
