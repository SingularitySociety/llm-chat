<template>
  <div>
    <h2 class="m-2 font-bold text-white">Account</h2>
    <div v-if="store.state.statistics">
      Today /{{ store.state.statistics.chatCounter }} Chat /
      {{ store.state.statistics.messageCounter }} Message
    </div>

    <div>
      <div>
        <input v-model="nickName" class="rounded-lg border-0 p-4" />
      </div>
      <div>
        <button
          class="m-2 rounded-lg border-2 bg-blue-600 p-2 font-bold text-white"
          @click="save"
        >
          保存
        </button>
      </div>
      <div v-if="isSaved" class="font-bold text-white">保存しました</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from "vue";
import { useUser, sleep } from "@/utils/utils";
import { useStore } from "vuex";
import { db } from "@/utils/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export default defineComponent({
  setup() {
    const store = useStore();
    const user = useUser();
    const nickName = ref("");
    const isSaved = ref(false);

    const path = computed(() => {
      return `users/${user.value?.uid}`;
    });
    const loadName = async () => {
      if (path.value) {
        const muser = await getDoc(doc(db, `${path.value}`));
        nickName.value = (muser.data() || {}).nickName;
      }
    };
    watch(path, async () => {
      loadName();
    });
    loadName();

    const save = async () => {
      if (path.value) {
        updateDoc(doc(db, `${path.value}`), { nickName: nickName.value });

        isSaved.value = true;
        await sleep(2);
        isSaved.value = false;
      }
    };

    return {
      store,
      nickName,
      save,
      isSaved,
    };
  },
});
</script>
