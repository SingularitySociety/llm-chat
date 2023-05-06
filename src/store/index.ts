import { createStore } from "vuex";
import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { specialUid, chatCreationlimit, messageCreationlimit } from "@/config/project";

interface State {
  user: User | null | undefined;
  statistics: DocumentData | null;
}

export default createStore<State>({
  state: {
    user: undefined,
    statistics: null,
  },
  mutations: {
    setUser(state: State, user: User | null) {
      state.user = user;
    },
    setStatistics(state: State, statistics: DocumentData | null) {
      state.statistics = statistics;
    },
  },
  getters: {
    isSignedIn: (state: State) => {
      return state.user !== null && state.user !== undefined;
    },
    isSubscribed: (state: State) => {
      if (state.user) {
        return true;
      }
    },
    canCreateChat: (state: State) => {
      return state.user && (
        (((state.statistics || {}).chatCounter || 0) < chatCreationlimit) || specialUid.includes(state.user.uid));
    },
    canCreateMessage: (state: State) => {
      return state.user && (
        (((state.statistics || {}).messageCounter || 0) < messageCreationlimit) || specialUid.includes(state.user.uid));
    },
  },
  actions: {},
  modules: {},
});
