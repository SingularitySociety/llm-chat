<template>
  <div class="home">
    {{ $t("title." + (chat.type || "loading")) }}
    <div class="mx-16 h-96 flex-col overflow-y-scroll rounded-lg border-2">
      <Messages :chat="chat" ref="messageRef" />
    </div>
    <div v-if="user && chat.uid === user.uid">
      <template v-if="errors['history']">
        <div v-for="(e, k) in errors['history']" :key="k">
          {{ $t("error.history." + e) }}
        </div>
      </template>
      <template v-else-if="errors['message']">
        <div v-for="(e, k) in errors['message']" :key="k">
          {{ $t("error.message." + e) }}
        </div>
      </template>

      <div class="mx-16">
        <form @submit.prevent="writeMessage">
          <textarea
            class="mt-4 h-24 w-full rounded-lg border-2 p-4"
            v-model="message"
            :placeholder="$t('placeholder.chatMessage')"
            :disabled="errors['history'] && errors['history'].length > 0"
          >
          </textarea>
          <button
            class="m-2 rounded-lg border-2 p-2 font-bold text-white"
            :class="hasError ? 'bg-blue-200' : 'bg-blue-600'"
            @click.prevent="writeMessage"
            :disabled="hasError"
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
import { defineComponent, ref, watch, onUnmounted, computed } from "vue";
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
import { useUser, useError, errorFuncBase } from "@/utils/utils";
import { stringLength } from "@/utils/common";

import Messages from "@/views/Chat/Messages.vue";
import Share from "@/components/Share.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    Messages,
    Share,
  },
  setup() {
    const route = useRoute();
    const user = useUser();
    const message = ref("");
    const messageRef = ref();

    const chatId = route.params.chatId as string;
    const chat = ref<DocumentData>({});
    onSnapshot(doc(db, `chats/${chatId}`), (c) => {
      chat.value = c.data() || {};
    });

    const errorFunc = () => {
      const { ret, addError } = errorFuncBase();
      if (stringLength(message.value) === 0) {
        addError("message", "empty");
      }
      // if (stringLength(message.value) > 200) {
      if ((message.value || "").length > 1000) {
        addError("message", "tooLong");
      }
      if (messageRef.value?.historyTextCounter > 3000) {
        addError("history", "tooLong");
      }
      if (messageRef.value?.historyCounter > 10) {
        addError("history", "tooLong");
      }
      return ret;
    };

    const { hasError, errors } = useError(errorFunc);

    const writeMessage = async () => {
      const uid = user.value.uid;
      if (uid && message.value) {
        const data = {
          uid,
          message: message.value,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, `chats/${chatId}/tmp`), data);
        message.value = "";
      }
    };

    return {
      chat,
      user,
      message,
      writeMessage,

      messageRef,

      errors,
      hasError,
    };
  },
});
</script>
