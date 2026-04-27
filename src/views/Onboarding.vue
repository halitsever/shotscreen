<template>
  <div class="drag flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100">
    <!-- Logo / title -->
    <div class="no-drag mb-10 text-center">
      <div class="mb-4 flex justify-center">
        <img src="../assets/logo.png" alt="Shotscreen" class="h-16 w-16 rounded-2xl" />
      </div>
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-100">Shotscreen Browser</h1>
      <p class="mt-2 text-sm text-zinc-500">Take clean, beautiful screenshots of any website.</p>
    </div>

    <!-- Feature cards -->
    <div class="no-drag mb-10 grid w-[420px] grid-cols-3 gap-3">
      <div v-for="feature in features" :key="feature.title" class="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300">
          <component :is="feature.icon" />
        </div>
        <p class="text-xs font-medium text-zinc-200">{{ feature.title }}</p>
        <p class="text-[11px] leading-relaxed text-zinc-500">{{ feature.desc }}</p>
      </div>
    </div>

    <!-- CTA -->
    <div class="no-drag flex flex-col items-center gap-3">
      <button class="rounded-md bg-zinc-100 px-8 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-white" @click="start">Get Started</button>
      <p class="text-[11px] text-zinc-600">You can always find these controls in the left sidebar.</p>
    </div>
  </div>
</template>

<script setup>
import { h } from "vue";

const emit = defineEmits(["done"]);

const IconSidebar = () =>
  h("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none" }, [
    h("rect", { x: "0.5", y: "0.5", width: "13", height: "13", rx: "2", stroke: "currentColor" }),
    h("path", { d: "M4.5 0.5v13", stroke: "currentColor" }),
  ]);

const IconViewport = () =>
  h("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none" }, [
    h("rect", { x: "0.5", y: "2.5", width: "13", height: "9", rx: "1.5", stroke: "currentColor" }),
    h("path", { d: "M4 11.5v1M10 11.5v1M3 12.5h8", stroke: "currentColor", "stroke-linecap": "round" }),
  ]);

const IconCamera = () =>
  h("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none" }, [
    h("rect", { x: "0.5", y: "3.5", width: "13", height: "9", rx: "1.5", stroke: "currentColor" }),
    h("path", { d: "M4.5 3.5L5.5 1.5h3l1 2", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round" }),
    h("circle", { cx: "7", cy: "8", r: "2.5", stroke: "currentColor" }),
  ]);

const features = [
  {
    icon: IconSidebar,
    title: "Sidebar Controls",
    desc: "Navigate to any URL, all from the persistent side panel.",
  },
  {
    icon: IconViewport,
    title: "Viewport Presets",
    desc: "Instantly resize to Mobile, Tablet, or Desktop dimensions.",
  },
  {
    icon: IconCamera,
    title: "Clean Screenshots",
    desc: "Captures only the webpage with rounded corners applied.",
  },
];

const start = async () => {
  await window.electronAPI.completeOnboarding();
  emit("done");
};
</script>
