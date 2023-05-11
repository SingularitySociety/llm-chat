import { App, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { defaultLanguage, messages } from "./";

export const i18nUtils = (app: App) => {
  app.config.globalProperties.localizedUrl = (path: string) => {
    const lang = app.config.globalProperties.$route.params.lang || "ja";
    if (lang) {
      return `/${lang}` + path;
    }
    return path;
  };
};

export const useI18nParam = () => {
  const route = useRoute();
  const i18n = useI18n();

  const lang = computed(() => {
    return (route.params.lang as string) || defaultLanguage;
  });
  watch(lang, () => {
    i18n.locale.value = lang.value;
  });
  i18n.locale.value = lang.value;
};

export const useLang = () => {
  const i18n = useI18n();

  const lang = computed(() => {
    return i18n.locale.value;
  });

  const localizedUrl = (path: string) => {
    if (lang.value) {
      return `/${lang.value}` + path;
    }
    return path;
  };

  return {
    lang,
    localizedUrl,
  };
};

export const youKey = (chatType: string) => {
  if ((messages.ja.you as any)[chatType]) {
    return "you." + chatType;
  }
  return "chatUser";
};

export const botKey = (chatType: string) => {
  if ((messages.ja.bot as any)[chatType]) {
    return "bot." + chatType;
  }
  return "botUser";
};
