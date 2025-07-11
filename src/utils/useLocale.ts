import { Locale, locales } from "@/i18n/routing";

const LOCALE_NAME = "NEXT_LOCALE";

export function setLocale() {
  const locale = window.location.pathname.split("/")[1] as Locale;
  const savedLocale = localStorage.getItem(LOCALE_NAME);
  const userLocale = navigator.language.split("-")[0] as Locale;

  if (!savedLocale) {
    if (userLocale && locales.includes(userLocale) && userLocale !== locale) {
      document.documentElement.lang = userLocale;
      localStorage.setItem(LOCALE_NAME, userLocale);
      window.location.replace(`/${userLocale}`);
    }
  }

  if (savedLocale && locale && savedLocale !== locale) {
    localStorage.setItem(LOCALE_NAME, locale);
  }
}
