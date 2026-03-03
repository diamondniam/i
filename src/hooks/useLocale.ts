import { Locale, locales } from "@/i18n/routing";

const LOCALE_NAME = "NEXT_LOCALE";

export function setLocale() {
  const locale = window.location.pathname.split("/")[1] as Locale;
  const savedLocale = localStorage.getItem(LOCALE_NAME);
  const userLocale = navigator.language.split("-")[0] as Locale;

  if (!savedLocale) {
    if (userLocale && locales.includes(userLocale)) {
      if (userLocale !== locale) {
        window.location.replace(`/${userLocale}`);
      }

      document.documentElement.lang = locale;
      localStorage.setItem(LOCALE_NAME, locale);
    }
  }

  if (savedLocale && locale && savedLocale !== locale) {
    localStorage.setItem(LOCALE_NAME, locale);
  }
}
