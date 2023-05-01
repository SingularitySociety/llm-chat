<template>
  <div class="home">
    {{ $t("title." + (chat.type || "loading")) }}
    <div class="mx-16 h-96 flex-col overflow-y-scroll rounded-lg border-2">
      <div
        v-if="(chat.histories || []).length === 0"
        class="m-4 flex text-left"
      >
        {{ $t("chat.empty") }}
      </div>
      <div
        v-else
        v-for="(v, k) in chat.histories || []"
        class="m-4 flex text-left"
        :key="k"
      >
        {{ $t(v.role === "user" ? "chatUser" : "title." + chat.type) }}:
        {{ v.content }}
      </div>

      <div
        v-for="(v, k) in histories || []"
        class="m-4 flex text-left"
        :key="k"
      >
        {{ $t("chat.user") }}: {{ v.message }} ( {{ $t("chat.loading") }})
      </div>
    </div>
    <div v-if="user && chat.uid === user.uid">
      <div class="mx-16">
        <form @submit.prevent="writeMessage">
          <textarea
            class="mt-4 h-24 w-full rounded-lg border-2 p-4"
            v-model="message"
            :placeholder="$t('placeholder.chatMessage')"
          >
          </textarea>
          <button
            class="m-2 rounded-lg border-2 p-2"
            @click.prevent="writeMessage"
          >
            {{ $t("chat.submit") }}
          </button>
        </form>
      </div>
    </div>

    <Share :title="chat.type || ''" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import {
  doc,
  DocumentData,
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "@/utils/utils";

import Share from "@/components/Share.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    Share,
  },
  setup() {
    const route = useRoute();
    const user = useUser();
    const message = ref("");

    const chatId = route.params.chatId as string;
    const chat = ref<DocumentData>({});
    onSnapshot(doc(db, `chats/${chatId}`), (c) => {
      chat.value = c.data() || {};
    });

    const writeMessage = async () => {
      const uid = user.value.uid;
      if (uid && message.value) {
        const data = {
          uid,
          message: message.value,
          createdAt: serverTimestamp(),
        };
        console.log(data);
        await addDoc(collection(db, `chats/${chatId}/tmp`), data);
        message.value = "";
      }
    };

    // history
    const histories = ref<DocumentData[]>([]);
    let detachers: Unsubscribe[] = [];

    watch([user, chat], () => {
      detachers.map((d) => {
        d();
      });
      detachers = [];
      const uid = user.value.uid;
      // console.log(user.value, chat.value);
      if (uid && chat.value.uid && chat.value.uid === uid) {
        const detacher = onSnapshot(
          query(collection(db, `chats/${chatId}/tmp`)),
          async (snapshot) => {
            console.log(snapshot.docs);
            histories.value = snapshot.docs.map((doc) => {
              const data = doc.data();
              data.id = doc.id;
              return data;
            });
          }
        );
        detachers.push(detacher);
      }
    });
    onUnmounted(() => {
      detachers.map((d) => {
        d();
      });
    });

    return {
      chat,
      user,
      message,
      writeMessage,
      histories,
    };
  },
});
</script>
