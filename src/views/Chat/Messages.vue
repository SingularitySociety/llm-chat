<template>
  <div class="message">
    <!-- chat not yet -->
    <div
      v-if="
        (chat.histories || []).length === 0 && (histories || []).length === 0
      "
      class="m-4 text-left"
    >
      <div v-if="isWrittable && introIndex !== null">
        <span class="font-bold">
          {{ $t(botKey(chat.type)) }}
        </span>
        : {{ introMessage }}
      </div>
      <div v-else>
        <div class="flex">
          {{ $t("chat.empty") }}
        </div>
        <div class="flex">
          {{
            $t("chat.emptyMessage", {
              chara: $t("title." + (chat.type || "loading")),
            })
          }}
        </div>
      </div>
    </div>

    <!-- chat log -->
    <div
      v-else
      v-for="(v, k) in chat.histories || []"
      class="m-4 text-left"
      :key="k"
    >
      <span class="font-bold">
        {{ $t(v.role === "user" ? youKey(chat.type) : botKey(chat.type)) }}
      </span>
      :
      {{ v.content }}
      {{ v.hasError ? "error" : "" }}
    </div>

    <div v-for="(v, k) in histories || []" class="m-4 flex text-left" :key="k">
      {{ $t("chatUser") }}: {{ v.message }} ( {{ $t("title.loading") }})
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onUnmounted,
  PropType,
  computed,
} from "vue";
import { useRoute } from "vue-router";
import {
  doc,
  DocumentData,
  collection,
  onSnapshot,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "@/utils/utils";
import { stringLength, historyTextCount, historyCount } from "@/utils/common";
import { youKey, botKey } from "@/i18n/utils";

export default defineComponent({
  name: "HomePage",
  props: {
    chat: {
      type: Object as PropType<DocumentData>,
      required: true,
    },
    isWrittable: {
      type: Boolean,
    },
    introMessage: {
      type: String,
    },
    introIndex: {
      type: Number,
    },
  },
  setup(props, ctx) {
    const route = useRoute();
    const user = useUser();

    const chatId = route.params.chatId as string;

    const historyTextCounter = computed(() => {
      return historyTextCount(props.chat.histories || []);
    });
    const historyCounter = computed(() => {
      return historyCount(props.chat.histories || []);
    });

    // history
    const histories = ref<DocumentData[]>([]);
    let detachers: Unsubscribe[] = [];

    const wasChange = computed(() => {
      return [user.value, props.chat];
    });
    watch(wasChange, () => {
      detachers.map((d) => {
        d();
      });
      detachers = [];
      const uid = user.value?.uid;
      // console.log(user.value, props.chat);
      if (uid && props.chat.uid && props.chat.uid === uid) {
        const detacher = onSnapshot(
          query(collection(db, `chats/${chatId}/tmp`)),
          async (snapshot) => {
            histories.value = snapshot.docs.map((doc) => {
              const data = doc.data();
              data.id = doc.id;
              return data;
            });
            ctx.emit("updatedMessage");
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
      user,
      histories,

      historyTextCounter,
      historyCounter,

      youKey,
      botKey,
    };
  },
});
</script>
