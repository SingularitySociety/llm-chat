<template>
  <div class="home mx-8 my-2">
    <h2 class="text-lg font-bold" v-if="user">{{ $t("home.chooseOne") }}</h2>
    <h2 class="text-lg font-bold" v-else>{{ $t("home.requireLogin") }}</h2>
    <div>
      <div v-if="user" class="font-bold text-white">
        １日にチャットが出来る相手は１人だけ。ここから選んでね。
      </div>
      <span v-for="(v, k) in Object.keys(prompts)" :key="k">
        <button
          class="m-2 rounded-lg bg-sky-400 p-2 font-bold text-white"
          @click="choose(v)"
          v-if="user"
        >
          {{ $t("title." + v) }}
        </button>
        <button
          class="m-2 rounded-lg bg-sky-400 bg-opacity-40 p-2 font-bold text-white text-opacity-40"
          :disabled="true"
          v-else
        >
          {{ $t("title." + v) }}
        </button>
      </span>
    </div>

    <div v-if="user === undefined" />
    <History v-else-if="user" class="rounded-lg bg-white bg-opacity-70"
             ref="historyRef"/>
    <div v-else>
      <Login />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { prompts } from "@/utils/prompts";
import { useUser } from "@/utils/utils";
import { serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useRouter } from "vue-router";
import { useLang } from "@/i18n/utils";

import History from "@/views/Home/History.vue";
import Login from "@/views/Login.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    History,
    Login,
  },
  setup() {
    const historyRef = ref();
    const router = useRouter();
    const user = useUser();
    const { localizedUrl } = useLang();

    const choose = async (v: string) => {
      if (!user.value) {
        router.push(localizedUrl("/login"));
        return;
      }
      if (historyRef.value.histories && historyRef.value.histories.length > 0) {
        const match = historyRef.value.histories.find((a: any) => {
          return a.type === v && a.counter === 0
        });
        if (match) {
          router.push(localizedUrl(`/chats/${match.id}`));
          return 
        }
      }
      
      const uid = user.value?.uid;
      if (uid && v) {
        const data = {
          type: v,
          uid,
          createdAt: serverTimestamp(),
        };

        const ret = await addDoc(collection(db, "chats"), data);
        const id = ret.id;
        router.push(localizedUrl(`/chats/${id}`));
      }
    };

    return {
      choose,
      historyRef,
      prompts,
      user,
    };
  },
});
</script>
