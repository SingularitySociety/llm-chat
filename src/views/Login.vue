<template>
  <div class="account mt-4">
    <a
      @click="twitterSignin"
      class="inline-flex h-12 items-center justify-center rounded-lg bg-black bg-white bg-opacity-70 px-6 shadow-lg hover:bg-red-200 hover:text-white"
    >
      {{ $t("twitterLogin") }}
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { twitterSignin } from "../utils/SocialLogin";
import { useRouter } from "vue-router";
import { useLang } from "@/i18n/utils";

export default defineComponent({
  name: "AccountPage",
  setup() {
    const router = useRouter();
    const { localizedUrl } = useLang();

    return {
      twitterSignin: twitterSignin(
        () => {
          // alert("OK");
          router.push(localizedUrl("/"));
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
