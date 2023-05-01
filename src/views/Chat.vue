<template>
  <div class="home">
    type: {{ chat.type }}
    <div class="mx-16 h-96 flex-col rounded-lg border-2">
      <div class="m-4 flex">a</div>
      <div class="m-4 flex">a</div>
      <div class="m-4 flex">a</div>
      <div class="m-4 flex"></div>
    </div>
    <div v-if="user && chat.uid === user.uid">
      <div class="mx-16">
        <form @submit.prevent="writeMessage">
          <textarea
            class="mt-4 h-24 w-full rounded-lg border-2 p-4"
            v-model="message"
          >
          </textarea>
          <button class="m-2 rounded-lg border-2 p-2" @click="writeMessage">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  getDoc,
  doc,
  DocumentData,
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "@/utils/utils";

export default defineComponent({
  name: "HomePage",

  setup() {
    const route = useRoute();
    const user = useUser();
    const message = ref("");

    const chatId = route.params.chatId as string;
    const chat = ref<DocumentData>({});
    getDoc(doc(db, `chats/${chatId}`)).then((c) => {
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
      if (uid && chat.value.id && chat.value.uid === uid) {
        const detacher = onSnapshot(
          query(
            collection(db, `chats/${chatId}/tmp`),
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
