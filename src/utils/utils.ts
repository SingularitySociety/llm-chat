import { computed, ref, onUnmounted } from "vue";
import { useStore } from "vuex";
import { cdate } from "cdate";

export const useUser = () => {
  const store = useStore();
  const user = computed(() => store.state.user);
  return user;
};
export const useIsSignedIn = () => {
  const store = useStore();
  const isSignedIn = computed(() => !!store.state.user);
  return isSignedIn;
};

export const errorFuncBase = () => {
  const ret: { [key: string]: string[] } = {};
  const addError = (key: string, message: string) => {
    if (ret[key] === undefined) {
      ret[key] = [];
    }
    ret[key].push(message);
  };
  return {
    ret,
    addError,
  };
};

export const useError = (errorFunc: () => { [key: string]: any[] }) => {
  const errors = computed(errorFunc);

  const hasError = computed(() => {
    return (
      Object.keys(errors.value).reduce((tmp, current) => {
        return tmp + errors.value[current].length;
      }, 0) > 0
    );
  });

  const isError = (key: string) => {
    return (errors.value[key] || []).length > 0;
  };
  const errorComments = (key: string) => {
    return errors.value[key] || [];
  };

  return {
    errors,
    hasError,
    isError,
    errorComments,
  };
};

export const sleep = async (seconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const useTimer = () => {
  const getCurrentTime = () => {
    return cdate().format("YYYYMMDD");
  };
  return useTimerBase(getCurrentTime, 10);
};

export const useTimerBase = (getCurrentTime: () => any, sleepTime?: number) => {
  let loop = true;

  const now = ref(getCurrentTime());

  onUnmounted(() => {
    loop = false;
  });
  (async () => {
    while (loop) {
      now.value = getCurrentTime();
      await sleep(sleepTime || 0.1);
    }
  })();

  return now;
};

export const arrayChunk = <T>(arr: T[], size = 1) => {
  const array = [...arr];
  return array.reduce((current: T[][], value: T, index: number) => {
    return index % size
      ? current
      : [...current, array.slice(index, index + size)];
  }, []);
};
