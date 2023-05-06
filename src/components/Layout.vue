<template>
  <div class="layout h-full min-h-screen font-noto font-medium">
    <HeaderMenu />
    <router-view />
    <FooterMenu />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";

import { auth } from "@/utils/firebase";
import { User, signInAnonymously } from "firebase/auth";

import { useI18nParam } from "@/i18n/utils";
import { cdate } from "cdate";
import { useTimer } from "@/utils/utils";

import {
  doc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/utils/firebase";

import HeaderMenu from "@/components/HeaderMenu.vue";
import FooterMenu from "@/components/FooterMenu.vue";

interface UserData {
  user: User | null;
}

export default defineComponent({
  name: "AppLayout",
  components: {
    HeaderMenu,
    FooterMenu,
  },
  async setup() {
    const store = useStore();
    const user = reactive<UserData>({ user: null });
    useI18nParam();

    const date = useTimer();
    
    onMounted(() => {
      auth.onAuthStateChanged((fbuser) => {
        if (fbuser) {
          console.log("authStateChanged:");
          user.user = fbuser;
          store.commit("setUser", fbuser);
        } else {
          store.commit("setUser", null);
          // signInAnonymously(auth);
        }
      });
    });
    let detacher: Unsubscribe | null = null;

    watch([user, date], () => {
      if (detacher) {
        detacher()
      }
      detacher = null;
      if (user.user) {
        // console.log(date);
        const path = `users/${user.user.uid}/statistics/${date.value}`;
        // console.log(path);
        detacher = onSnapshot(
          doc(db, path),
          async (snapshot) => {
            store.commit("setStatistics", snapshot.data())
            // console.log(snapshot.data());
          })
      }
    });

    return {
      user,
    };
  },
});
</script>

<style>
.layout {
  background-color: hsla(258, 100%, 49%, 1);
  background-image: radial-gradient(
      at 0% 0%,
      hsla(341, 100%, 55%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 0% 64%, hsla(296, 100%, 57%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(172, 100%, 50%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(47, 100%, 61%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 36%, hsla(36, 100%, 50%, 1) 0px, transparent 50%),
    radial-gradient(at 30% 26%, hsla(340, 100%, 53%, 1) 0px, transparent 50%),
    radial-gradient(at 51% 0%, hsla(22, 100%, 62%, 1) 0px, transparent 50%);
}
</style>
