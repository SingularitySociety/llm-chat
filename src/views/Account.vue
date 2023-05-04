<template>
  <div class="account">
    <a
      @click="twitterSignin"
      class="inline-flex h-12 items-center justify-center rounded-lg bg-black bg-opacity-5 px-6 shadow-lg hover:bg-green-600 hover:text-white"
    >
      Signin with Twitter account
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { twitterSignin } from "../utils/SocialLogin";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AccountPage",
  setup() {
    const router = useRouter();

    return {
      twitterSignin: twitterSignin(
        () => {
          // alert("OK");
          router.push("/");
          console.log("ok");
        },
        (err) => {
          alert(err.message);
        }
      ),
    };
  },
});
</script>
