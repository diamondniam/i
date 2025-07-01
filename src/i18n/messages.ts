import { getComponents } from "@/i18n/routes";

const set = require("lodash/set");

export default async function getMessages(locale: string) {
  const input = {
    components: await getComponents(locale),
  };

  const output = Object.entries(input).reduce(
    (acc, [key, value]) => set(acc, key, value),
    {}
  );

  return output;
}
