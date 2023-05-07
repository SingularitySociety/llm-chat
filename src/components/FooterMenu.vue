<template>
  <div class="p-10 font-bold text-white">
    <div>
      <span>
        <router-link :to="localizedUrl('/')">
          {{ $t("menu.home") }}
        </router-link>
        |
        <router-link :to="localizedUrl('/privacy')">
          {{ $t("menu.privacy") }} 
        </router-link>
      </span>
    </div>
    <div v-if="isSignedIn">
      <span>
        <router-link :to="localizedUrl('/account')">{{
          $t("menu.account")
          }}</router-link>
        |<span @click="signout" class="cursor-pointer">{{
          $t("menu.signout")
          }}</span>
      </span>
    </div>
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
