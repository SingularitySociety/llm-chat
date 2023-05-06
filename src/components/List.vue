<template>
<div>
  <h2 class="text-lg font-bold">{{ $t("home.list") }}</h2>
  <div v-for="(chat, k) in chats" :key="k" class="text-left mx-2">
    <router-link :to="`/chats/${chat.id}`">
      {{ $t("title." + chat.type) }}
      {{
      cdate(chat.createdAt?.toDate())
      .tz("Asia/Tokyo")
      .format("YYYY/MM/DD HH:mm")
      }}
      ({{ (users[chat.uid] || {}).nickName }})
    </router-link>
  </div>
</div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from "vue";
import {
  getDocs,
  query,
  collection,
  orderBy,
  DocumentData,
  documentId,
  where,
} from "firebase/firestore";
import { db } from "@/utils/firebase";

import { cdate } from "cdate";
import {
  arrayChunk
} from "@/utils/utils";

export default defineComponent({
  setup() {
    const chats = ref<DocumentData[]>([]);
    const users = ref<{[key: string]: DocumentData}>({});
    getDocs(query(collection(db, "chats"), orderBy("createdAt", "desc"))).then(
      async (a) => {
        chats.value = a.docs.map((b) => {
          const data = b.data();
          data.id = b.id;
          return data;
        }).filter(a => {
          return a.counter > 3;
        });
        const uids = [...new Set(chats.value.map(a => a.uid))];
        const u: {[key: string]: DocumentData} = {};
        await Promise.all(arrayChunk(uids, 10).map(async(ids) => {
          const ret = await getDocs(query(
            collection(db, "users"),
            where(documentId(), "in", ids)
          ));
          ret.docs.map(a => {
            u[a.id as string] = a.data();
          });
        }));
        users.value = u;
    });
    
    return {
      chats,
      cdate,
      users,
    };
  },
});
</script>
