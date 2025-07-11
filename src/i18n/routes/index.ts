import { components } from "@/i18n/routes/components";
import { Locale } from "@/i18n/routing";

const messages = (locale: Locale) => ({ components: components(locale) });

export default messages;
