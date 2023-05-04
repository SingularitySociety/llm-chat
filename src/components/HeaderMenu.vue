<template>
<div id="nav fl">
  <div class="flex items-center justify-center">
    <div class="flex-item">
      <router-link to="/">
        <img :src="logo" class="w-12 fill-white" />
      </router-link>
    </div>
    <div class="flex-item text-2xl text-white">
      <router-link to="/">
        <span class="font-serif tefont-2xl">im</span>
        <span class="font-sans font-2xl">prompt</span>
      </router-link>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import logo from "@/components/LogoMark.svg?raw";


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
