import { Locale } from "@/i18n/routing";
import en from "@public/locales/en/components/footer.json";
import ru from "@public/locales/ru/components/footer.json";

export const footer = (locale: Locale) => ({ en, ru })[locale];
