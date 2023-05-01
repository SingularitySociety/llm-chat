<template>
  <div class="home">
    <h2 class="text-lg font-bold">Choose one</h2>
    <span v-for="(v, k) in Object.keys(prompts)" :key="k">
      <button
        class="m-2 rounded-lg bg-sky-400 p-2 text-white"
        @click="choose(v)"
      >
        {{ $t("button." +v) }}
      </button>
    </span>
    <div>
      Your History

      <div v-for="(h, k) in histories" :key="k">
        <router-link :to="`chats/${h.id}`">
          {{ h.id }}
          {{ h.type }}
          {{ h.create }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onUnmounted } from "vue";
import { prompts } from "@/utils/prompts";
import { useUser } from "@/utils/utils";
import {
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const router = useRouter();
    const user = useUser();

    const choose = async (v: string) => {
      const uid = user.value.uid;
      if (uid && v) {
        console.log(v);
        const data = {
          type: v,
          uid,
          createdAt: serverTimestamp(),
        };

        const ret = await addDoc(collection(db, "chats"), data);
        const id = ret.id;
        router.push(`/chats/${id}`);
      }
    };

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
    }
    watch(user, load);
    load();
    onUnmounted(() => {
      detachers.map((d) => {
        d();
      });
    });

    return {
      choose,
      prompts,

      histories,
    };
  },
});
</script>
