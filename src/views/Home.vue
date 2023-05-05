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
    <History v-else-if="user" class="rounded-lg bg-white bg-opacity-70" />
    <div v-else>
      <Account />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { prompts } from "@/utils/prompts";
import { useUser } from "@/utils/utils";
import { serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useRouter } from "vue-router";
import { useLang } from "@/i18n/utils";

import History from "@/views/Home/History.vue";
import Account from "@/views/Account.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    History,
    Account,
  },
  setup() {
    const router = useRouter();
    const user = useUser();
    const { localizedUrl } = useLang();

    const choose = async (v: string) => {
      if (!user.value) {
        router.push(localizedUrl("/account"));
        return;
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
      prompts,
      user,
    };
  },
});
</script>
