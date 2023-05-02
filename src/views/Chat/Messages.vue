<template>
  <div>
    <div
      v-if="(chat.histories || []).length === 0 && ( histories || []).length === 0"
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
      {{ v.hasError ? "error" : ""}}
    </div>
    
    <div
      v-for="(v, k) in histories || []"
      class="m-4 flex text-left"
      :key="k"
      >
      {{ $t("chatUser") }}: {{ v.message }} ( {{ $t("title.loading") }})
    </div>
    {{ historyCounter }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onUnmounted, PropType, computed } from "vue";
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
import { stringLength } from "@/utils/common";

export default defineComponent({
  name: "HomePage",
  props: {
    chat: {
      type: Object as PropType<DocumentData>,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const user = useUser();

    const chatId = route.params.chatId as string;

    const historyCounter = computed(() => {
      return (props.chat.histories || []).reduce((tmp: number, c: any) => {
        if (!c.hasError) {
          // for ja.
          const len = stringLength(c.content);
          return tmp + len;
        }
        return tmp;
      }, 0);
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
      const uid = user.value.uid;
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

      historyCounter,
    };
  },
});
</script>
