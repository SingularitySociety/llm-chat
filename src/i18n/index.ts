import en from "./en";
import ja from "./ja";

export const defaultLanguage = "ja";

const messages = {
  en,
  ja,
};

const config = {
  legacy: false,
  locale: defaultLanguage,
  messages,
};

export const languages = Object.keys(messages);

export default config;
