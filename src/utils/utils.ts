import { computed } from "vue";
import { useStore } from "vuex";

export const useUser = () => {
  const store = useStore();
  const user = computed(() => store.state.user);
  return user;
};
export const useIsSignedIn = () => {
  const store = useStore();
  const isSignedIn = computed(() => store.getters.isSignedIn);
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
  }
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
