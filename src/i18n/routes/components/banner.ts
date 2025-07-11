import { Locale } from "@/i18n/routing";
import en from "@public/locales/en/components/banner.json";
import ru from "@public/locales/ru/components/banner.json";

export const banner = (locale: Locale) => ({ en, ru })[locale];
