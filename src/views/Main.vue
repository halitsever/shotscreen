<template>
  <div class="relative flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">

    <!-- Sidebar -->
    <aside class="flex w-[220px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">

      <!-- Header / drag handle -->
      <div class="drag flex h-11 shrink-0 items-center border-b border-zinc-800 pl-[72px] pr-4">
        <span class="select-none text-xs font-medium tracking-wide text-zinc-500">
          Shotscreen
        </span>
      </div>

      <!-- Controls -->
      <div class="flex flex-col gap-5 overflow-y-auto p-4">

        <!-- URL -->
        <div class="space-y-1.5">
          <p class="text-xs font-medium text-zinc-400">URL</p>
          <div class="flex gap-2">
            <input
              v-model="targetUrl"
              type="text"
              placeholder="https://"
              class="input min-w-0 flex-1"
              @keyup.enter="visitUrl"
            />
            <button class="btn-outline no-drag shrink-0" @click="visitUrl">
              Go
            </button>
          </div>
        </div>

        <hr class="border-zinc-800" />

        <!-- Viewport presets -->
        <div class="space-y-2">
          <p class="text-xs font-medium text-zinc-400">Viewport</p>
          <div class="grid grid-cols-3 gap-1.5">
            <button
              v-for="preset in presets"
              :key="preset.label"
              :class="[
                'no-drag rounded-md py-1.5 text-[11px] font-medium transition-all duration-150',
                activePreset === preset.label
                  ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                  : 'border border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300',
              ]"
              @click="applyPreset(preset)"
            >
              {{ preset.label }}
            </button>
          </div>
          <p class="tabular-nums text-[11px] text-zinc-600">
            {{ windowWidth }} × {{ windowHeight }} px
          </p>
        </div>

        <hr class="border-zinc-800" />

        <!-- Custom size -->
        <div class="space-y-1.5">
          <p class="text-xs font-medium text-zinc-400">Custom Size</p>
          <div class="flex items-center gap-2">
            <input
              v-model.number="windowWidth"
              type="number"
              placeholder="W"
              class="input w-0 flex-1"
              @input="activePreset = null"
            />
            <span class="text-xs text-zinc-600">×</span>
            <input
              v-model.number="windowHeight"
              type="number"
              placeholder="H"
              class="input w-0 flex-1"
              @input="activePreset = null"
            />
          </div>
          <button class="btn-outline no-drag mt-0.5 w-full" @click="applyWindowResize">
            Apply
          </button>
        </div>

      </div>

      <!-- Screenshot — pinned bottom -->
      <div class="mt-auto space-y-2 border-t border-zinc-800 p-4">
        <button
          :disabled="isCapturingScreenshot"
          class="no-drag w-full rounded-md bg-zinc-100 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          @click="takeScreenshot"
        >
          {{ isCapturingScreenshot ? "Capturing…" : "Take Screenshot" }}
        </button>
        <p
          v-if="statusMessage"
          class="break-all text-[10px] leading-relaxed text-zinc-500"
        >
          {{ statusMessage }}
        </p>
      </div>
    </aside>

    <!-- Browser -->
    <webview
      ref="browserView"
      class="h-full flex-1"
      :src="activeUrl"
      allowpopups
    />

    <!-- Toast -->
    <Transition
      enter-from-class="translate-y-3 opacity-0"
      enter-active-class="transition-all duration-200 ease-out"
      leave-to-class="translate-y-3 opacity-0"
      leave-active-class="transition-all duration-150 ease-in"
    >
      <div
        v-if="toast"
        class="absolute bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 shadow-xl"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="7" stroke="#22c55e" />
          <path d="M4.5 7.5l2 2 4-4" stroke="#22c55e" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"/>
        </svg>
        <div>
          <p class="text-sm font-medium text-zinc-100">Screenshot saved</p>
          <p class="max-w-[220px] truncate text-[11px] text-zinc-500">{{ toast }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const SIDEBAR_WIDTH = 220;

const presets = [
  { label: "Mobile", width: 390, height: 844 },
  { label: "Tablet", width: 768, height: 1024 },
  { label: "Desktop", width: 1440, height: 900 },
];

const browserView = ref(null);
const targetUrl = ref("https://halitsever.github.io/shotscreen-browser/");
const activeUrl = ref("https://halitsever.github.io/shotscreen-browser/");
const windowWidth = ref(1000);
const windowHeight = ref(800);
const activePreset = ref(null);
const statusMessage = ref("");
const isCapturingScreenshot = ref(false);
const toast = ref(null);
let toastTimer = null;

const showToast = (filePath) => {
  clearTimeout(toastTimer);
  toast.value = filePath;
  toastTimer = setTimeout(() => {
    toast.value = null;
  }, 3000);
};

const normalizeUrl = (url) => {
  if (!url) return null;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

const visitUrl = () => {
  const normalized = normalizeUrl(targetUrl.value);
  if (!normalized) return;
  activeUrl.value = normalized;
  targetUrl.value = normalized;
  statusMessage.value = "";
};

const applyPreset = (preset) => {
  windowWidth.value = preset.width;
  windowHeight.value = preset.height;
  activePreset.value = preset.label;
  window.electronAPI.resizeWindow({
    width: preset.width + SIDEBAR_WIDTH,
    height: preset.height,
  });
};

const applyWindowResize = () => {
  if (!windowWidth.value || !windowHeight.value) return;
  window.electronAPI.resizeWindow({
    width: windowWidth.value + SIDEBAR_WIDTH,
    height: windowHeight.value,
  });
};

const applyBorderRadius = (base64, radius) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.roundRect(0, 0, img.width, img.height, radius);
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = `data:image/png;base64,${base64}`;
  });

const takeScreenshot = async () => {
  try {
    isCapturingScreenshot.value = true;
    statusMessage.value = "";

    const webContentsId = browserView.value.getWebContentsId();
    const raw = await window.electronAPI.captureWebviewRaw(webContentsId);
    const dataUrl = await applyBorderRadius(raw, 12);
    const result = await window.electronAPI.saveScreenshot(dataUrl);

    if (result?.canceled) {
      statusMessage.value = "Canceled.";
      return;
    }
    statusMessage.value = "";
    showToast(result.filePath);
  } catch {
    statusMessage.value = "Error capturing screenshot.";
  } finally {
    isCapturingScreenshot.value = false;
  }
};

onMounted(() => {
  browserView.value?.addEventListener("did-navigate", (e) => {
    targetUrl.value = e.url;
    activeUrl.value = e.url;
  });
  browserView.value?.addEventListener("did-navigate-in-page", (e) => {
    targetUrl.value = e.url;
    activeUrl.value = e.url;
  });
});
</script>
