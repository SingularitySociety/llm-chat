<template>
  <div>
    <h2 class="text-lg font-bold">{{ $t("home.history") }}</h2>
    <div v-if="histories.length === 0">
      {{ $t("home.noHistory") }}
    </div>
    <div v-else>
      <div v-for="(h, k) in histories" :key="k" class="mx-2 text-left">
        <router-link :to="localizedUrl(`/chats/${h.id}`)">
          {{ $t("title." + h.type) }}
          {{
            cdate(h.createdAt?.toDate())
              .tz("Asia/Tokyo")
              .format("YYYY/MM/DD HH:mm")
          }}
          ({{ Math.floor((h.histories || []).length / 2) }}msgs)
        </router-link>
      </div>
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
import { cdate } from "cdate";

export default defineComponent({
  setup() {
    const user = useUser();

    // history
    const histories = ref<DocumentData[]>([]);
    let detachers: Unsubscribe[] = [];
    const load = () => {
      detachers.map((d) => {
        d();
      });
      detachers = [];
      if (user.value) {
        const uid = user.value.uid;
        const detacher = onSnapshot(
          query(
            collection(db, "chats"),
            where("uid", "==", uid),
            orderBy("createdAt", "desc")
          ),
          async (snapshot) => {
            histories.value = snapshot.docs.map((doc) => {
              const data = doc.data();
              data.id = doc.id;
              return data;
            });
          }
        );
        detachers.push(detacher);
      } else {
        histories.value = [];
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
      cdate,
    };
  },
});
</script>
