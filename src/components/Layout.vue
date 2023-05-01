<template>
  <div class="layout">
    <HeaderMenu />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { useStore } from "vuex";

import { auth } from "@/utils/firebase";
import { User, signInAnonymously } from "firebase/auth";

import { useI18nParam } from "@/i18n/utils";

import HeaderMenu from "@/components/HeaderMenu.vue";

interface UserData {
  user: User | null;
}

export default defineComponent({
  name: "AppLayout",
  components: {
    HeaderMenu,
  },
  async setup() {
    const store = useStore();
    const user = reactive<UserData>({ user: null });
    useI18nParam();

    onMounted(() => {
      auth.onAuthStateChanged((fbuser) => {
        if (fbuser) {
          console.log("authStateChanged:");
          user.user = fbuser;
          store.commit("setUser", fbuser);
        } else {
          store.commit("setUser", null);
          signInAnonymously(auth);
        }
      });
    });

    return {
      user,
    };
  },
});
</script>
