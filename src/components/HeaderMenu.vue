<template>
  <div id="nav fl">
    <div class="flex items-center justify-center">
      <div class="flex-item">
        <router-link to="/">
          <img :src="logo" class="h-10" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import logo from "@/components/Logo-Horizontal.svg?raw";

export default defineComponent({
  components: {
    // Languages,
    // Logo,
  },
  setup() {
    return {
      logo,
    };
  },
});
</script>
