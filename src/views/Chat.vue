<template>
  <div class="home">
    <div v-if="notFound">not found</div>
    <div v-else>
      <div class="m-2 text-3xl font-bold text-white">
        {{ $t("title." + (chat.type || "loading")) }}
      </div>
      <!-- Message -->
      <div v-if="user === undefined" />
      <div
        v-else-if="user === null"
        class="mx-8 flex-col rounded-lg bg-white bg-opacity-70 py-2"
      >
        <Messages :chat="chat" />
      </div>
      <div
        v-else
        class="mx-16 h-96 flex-col overflow-y-scroll rounded-lg bg-white bg-opacity-70 py-2"
        ref="messageWrapperRef"
      >
        <!-- for chat owner -->
        <Messages
          :chat="chat"
          ref="messageRef"
          :isWrittable="isWrittable"
          :introIndex="introIndex"
          :introMessage="introMessage"
          @updatedMessage="scrollMessage"
        />
      </div>

      <!-- write message -->
      <div v-if="isWrittable">
        <template v-if="errors['history']">
          <div
            v-for="(e, k) in errors['history']"
            :key="k"
            class="mt-2 font-bold text-white text-opacity-80"
          >
            {{ $t("error.history." + e) }}
          </div>
        </template>
        <template v-else-if="errors['message']">
          <div
            v-for="(e, k) in errors['message']"
            :key="k"
            class="mt-2 font-bold text-white text-opacity-80"
          >
            {{ $t("error.message." + e) }}
          </div>
        </template>

        <div class="mx-16">
          <form @submit.prevent="writeMessage">
            <textarea
              class="mt-4 h-24 w-full rounded-lg p-4"
              v-model="message"
              :placeholder="$t('placeholder.chatMessage')"
              :disabled="
                (errors['history'] && errors['history'].length > 0) || isWriting
              "
            >
            </textarea>
            <button
              class="m-2 rounded-lg border-2 p-2 font-bold text-white"
              :class="hasError ? 'bg-blue-200' : 'bg-blue-600'"
              @click.prevent="writeMessage"
              :disabled="hasError || isWriting"
            >
              {{ $t("chat.submit") }}
            </button>
          </form>
        </div>
      </div>

      <Share :title="chat.type || ''" class="m-4" />
    </div>
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
import { prompts } from "@/utils/prompts";
import { useStore } from "vuex";

import Messages from "@/views/Chat/Messages.vue";
import Share from "@/components/Share.vue";

export default defineComponent({
  components: {
    Messages,
    Share,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const user = useUser();
    const message = ref("");

    const messageRef = ref();
    const messageWrapperRef = ref();
    const notFound = ref<boolean | null>(null);

    const chatId = route.params.chatId as string;
    const chat = ref<DocumentData>({});
    const introIndex = ref<number | null>(null);
    const introMessage = ref<string | null>(null);
    onSnapshot(doc(db, `chats/${chatId}`), (c) => {
      chat.value = c.data() || {};
      notFound.value = !c.data();
      if (!notFound.value && !chat.value.histories) {
        const prompt = (prompts as any)[chat.value.type];
        if (!prompt.wip) {
          if (prompt.intro && introIndex.value === null) {
            introIndex.value = Math.floor(Math.random() * prompt.intro.length);
            introMessage.value = prompt.intro[introIndex.value];
          }
        }
        if (prompt.sample && !isWriting.value) {
          message.value = prompt.sample;
        }
      }
    });

    const isWrittable = computed(() => {
      return user.value && chat.value.uid === user.value.uid && store.getters.canCreateMessage; 
    });

    const isWriting = ref(false);
    let writingDetacher: Unsubscribe | null = null;
    const watchWriting = async () => {
      if (writingDetacher) {
        writingDetacher();
      }
      if (isWrittable.value) {
        writingDetacher = onSnapshot(
          collection(db, `chats/${chatId}/tmp`),
          (c) => {
            isWriting.value = c.docs.length > 0;
          }
        );
      }
    };
    if (isWrittable.value) {
      watchWriting();
    }
    watch(isWrittable, () => {
      watchWriting();
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
      if (messageRef.value?.historyCounter > 17) {
        addError("history", "tooLong");
      }
      return ret;
    };

    const { hasError, errors } = useError(errorFunc);

    let writtenMessage = false;
    const writeMessage = async () => {
      const uid = user.value.uid;
      if (uid && message.value) {
        const data = {
          uid,
          message: message.value,
          createdAt: serverTimestamp(),
          introIndex: introIndex.value || 0,
        };
        await addDoc(collection(db, `chats/${chatId}/tmp`), data);
        message.value = "";
        writtenMessage = true;
      }
    };

    const scrollMessage = () => {
      if (writtenMessage) {
        messageWrapperRef.value.scrollTop =
          messageWrapperRef.value.scrollHeight;
      }
    };

    return {
      chat,
      user,
      message,
      writeMessage,

      messageRef,
      messageWrapperRef,
      scrollMessage,

      errors,
      hasError,

      isWrittable,
      isWriting,

      notFound,
      introIndex,
      introMessage,

      store,
    };
  },
});
</script>
