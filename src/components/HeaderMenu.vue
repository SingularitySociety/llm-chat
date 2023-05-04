<template>
<div id="nav fl">
  <div class="flex m-auto">
    <div class="flex-item">
      <img :src="logo" class="w-12 fill-white" />
    </div>
    <div class="flex-item text-2xl">
      <span class="font-serif tefont-2xl">im</span>
      <span class="font-sans font-2xl">prompt</span>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useIsSignedIn } from "@/utils/utils";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";

// import Logo from "@/components/LogoMark.vue";
import logo from "@/components/LogoMark.svg?raw";

// import Languages from "./Languages.vue";

export default defineComponent({
  components: {
    // Languages,
    // Logo,
  },
  setup() {
    const isSignedIn = useIsSignedIn();

    const signout = () => {
      signOut(auth);
    };
    console.log(logo);
    return {
      isSignedIn,
      signout,
      logo,
    };
  },
});
</script>
