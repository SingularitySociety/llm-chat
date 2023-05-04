<template>
  <div id="nav fl">
    <template v-if="isSignedIn">
      <router-link :to="localizedUrl('/')">Home</router-link> |
      <span @click="signout">Signout</span>
    </template>
    <template v-else>
      <router-link :to="localizedUrl('/')">Home</router-link> |
      <router-link :to="localizedUrl('/account')">Signin</router-link>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useIsSignedIn } from "@/utils/utils";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";

// import Languages from "./Languages.vue";

export default defineComponent({
  components: {
//    Languages,
  },
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
