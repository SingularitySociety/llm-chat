<template>
  <div>
    <h2>Account</h2>
    <div v-if="store.state.statistics">
      Today /{{ store.state.statistics.chatCounter }} Chat /
      {{ store.state.statistics.messageCounter }} Message
    </div>
    {{ nickname }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from "vue";
import { useUser } from "@/utils/utils";
import { useStore } from "vuex";
import { db } from "@/utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default defineComponent({
  setup() {
    const store = useStore();
    const user = useUser();
    const nickname = ref("");

    const path = computed(() => {
      return `users/${user.value?.uid}`;
    });
    const loadName = async () => {
      if (path.value) {
        const muser = await getDoc(doc(db, `${path.value}`));
        nickname.value = (muser.data() || {}).nickName;
      }
    };
    watch(path, async () => {
      loadName();
    });
    loadName();

    return {
      store,
      nickname,
    };
  },
});
</script>
