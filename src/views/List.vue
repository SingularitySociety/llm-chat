<template>
  <div class="mx-16 my-2 rounded-lg bg-white bg-opacity-70 p-2">
    <div v-for="(chat, k) in chats" :key="k">
      <router-link :to="`/chats/${chat.id}`">
        {{ chat.type }}
        {{ (chat.histories || []).length }}
        {{
          cdate(chat.createdAt?.toDate())
            .tz("Asia/Tokyo")
            .format("YYYY/MM/DD HH:mm")
        }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  getDocs,
  query,
  collection,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/utils/firebase";

import { cdate } from "cdate";

export default defineComponent({
  setup() {
    const chats = ref<DocumentData[]>([]);
    getDocs(query(collection(db, "chats"), orderBy("createdAt", "desc"))).then(
      (a) => {
        chats.value = a.docs.map((b) => {
          const data = b.data();
          data.id = b.id;
          return data;
        });
      }
    );
    return {
      chats,
      cdate,
    };
  },
});
</script>
