import { Locale, locales } from "@/i18n/routing";

const LOCALE_NAME = "NEXT_LOCALE";

export function setLocale() {
  const locale = localStorage.getItem(LOCALE_NAME);

  if (!locale || locale !== document.documentElement.lang) {
    const userLocale = navigator.language.split("-")[0] as Locale;

    if (userLocale && locales.includes(userLocale)) {
      document.documentElement.lang = userLocale;
      localStorage.setItem(LOCALE_NAME, userLocale);
      window.location.replace(`/${userLocale}`);
    }
  }
}
