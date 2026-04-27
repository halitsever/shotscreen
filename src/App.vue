<template>
  <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-300" mode="out-in">
    <OnboardingView v-if="showOnboarding" key="onboarding" @done="showOnboarding = false" />
    <MainView v-else key="main" />
  </Transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MainView from "./views/Main.vue";
import OnboardingView from "./views/Onboarding.vue";

const showOnboarding = ref(false);

onMounted(async () => {
  showOnboarding.value = await window.electronAPI.isFirstLaunch();
});
</script>
