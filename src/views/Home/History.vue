<template>
  <div>
    <h2 class="text-lg font-bold">{{ $t("home.history") }}</h2>
    <div v-for="(h, k) in histories" :key="k" class="mx-2 text-left">
      <router-link :to="`chats/${h.id}`">
        {{ $t("title." + h.type) }}
        {{ h.createdAt?.toDate()?.toISOString() }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onUnmounted } from "vue";
import { useUser } from "@/utils/utils";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/utils/firebase";

export default defineComponent({
  setup() {
    const user = useUser();

    // history
    const histories = ref<DocumentData[]>([]);
    let detachers: Unsubscribe[] = [];
    const load = () => {
      if (user.value) {
        detachers.map((d) => {
          d();
        });
        detachers = [];
        const uid = user.value.uid;
        const detacher = onSnapshot(
          query(
            collection(db, "chats"),
            where("uid", "==", uid),
            orderBy("createdAt", "desc")
          ),
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
    };
    watch(user, load);
    load();
    onUnmounted(() => {
      detachers.map((d) => {
        d();
      });
    });
    return {
      histories,
    };
  },
})
</script>
