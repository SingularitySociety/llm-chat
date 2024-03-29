<template>
  <div class="home mx-8 my-2">
    <h2 class="text-lg font-bold" v-if="user">{{ $t("home.chooseOne") }}</h2>
    <h2 class="text-lg font-bold" v-else>{{ $t("home.requireLogin") }}</h2>
    <div>
      <div v-if="user" class="font-bold text-white">
        １日に話す相手を選べるのは２回だけ。
        <div v-if="!store.getters.canCreateChat">
          今日はもう新しい相手を選べません。チャット履歴からトークを再開できるよ。
        </div>
        <div v-else>ここから選んでね。</div>
        <div v-if="store.state.statistics">
          Today /{{ store.state.statistics.chatCounter }} Chat /
          {{ store.state.statistics.messageCounter }} Message
        </div>
      </div>
      <span v-for="(v, k) in Object.keys(prompts)" :key="k">
        <template v-if="!prompts[v].wip">
          <button
            class="m-2 rounded-lg bg-sky-400 p-2 font-bold text-white"
            @click="choose(v)"
            v-if="user && store.getters.canCreateChat"
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
        </template>
      </span>
    </div>

    <div v-if="user === undefined" />
    <History
      v-else-if="user"
      class="mb-8 rounded-lg bg-white bg-opacity-70 py-4"
      ref="historyRef"
    />
    <div class="rounded-lg bg-white bg-opacity-70 py-4">
      <List />
    </div>
    <div v-if="user === null">
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
import { useStore } from "vuex";

import History from "@/views/Home/History.vue";
import List from "@/components/List.vue";
import Login from "@/views/Login.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    History,
    Login,
    List,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = useUser();
    const historyRef = ref();
    const { localizedUrl } = useLang();

    const choose = async (v: string) => {
      if (!user.value) {
        router.push(localizedUrl("/login"));
        return;
      }
      if (historyRef.value.histories && historyRef.value.histories.length > 0) {
        const match = historyRef.value.histories.find((a: any) => {
          return a.type === v && a.counter === 0;
        });
        if (match) {
          router.push(localizedUrl(`/chats/${match.id}`));
          return;
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
      store,
    };
  },
});
</script>
