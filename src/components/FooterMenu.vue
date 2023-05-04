<template>
  <div class="p-10">
    <template v-if="isSignedIn">
      <span @click="signout" class="text-white font-bold">{{ $t("signout") }}</span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useIsSignedIn } from "@/utils/utils";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";

export default defineComponent({
  setup() {
    const isSignedIn = useIsSignedIn();

    const signout = () => {
      signOut(auth);
    };

    return {
      isSignedIn,
      signout,
    };
  },
});
</script>
