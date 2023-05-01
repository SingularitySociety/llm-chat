<template>
<div id="nav fl">
    <template v-if="isSignedIn">
      <router-link :to="localizedUrl('/')">Home</router-link> |
      <router-link :to="localizedUrl('/about')">About</router-link>
    </template>
    <template v-else>
      <router-link :to="localizedUrl('/')">Home</router-link> |
      <router-link :to="localizedUrl('/about')">About</router-link> |
      <router-link :to="localizedUrl('/account')">Signin</router-link>
    </template>
    <Languages />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useIsSignedIn } from "@/utils/utils";
import Languages from "./Languages.vue";

export default defineComponent({
  components: {
    Languages,
  },
  setup() {
    const isSignedIn = useIsSignedIn();

    return {
      isSignedIn,
    };
  },
});
</script>
