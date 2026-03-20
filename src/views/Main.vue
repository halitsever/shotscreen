<template>
  <div class="relative h-screen w-screen overflow-hidden bg-black">
    <div class="title-bar absolute top-0 left-0 right-0 z-30"></div>

    <webview
      ref="browserView"
      class="h-full w-full"
      :src="activeUrl"
      allowpopups
    />

    <button
      v-if="!isOverlayOpen && !isCapturingScreenshot"
      @click="toggleOverlay"
      class="absolute top-24 left-6 z-40 rounded-lg border border-white/40 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md hover:bg-black/55"
    >
      Open Overlay
    </button>

    <div
      v-if="isOverlayOpen && !isCapturingScreenshot"
      class="absolute z-40 w-[22rem] rounded-2xl border border-white/30 bg-black/35 backdrop-blur-md p-4 shadow-2xl"
      :style="overlayStyle"
    >
      <div
        class="mb-3 flex cursor-move items-center justify-between"
        @mousedown="startDragging"
      >
        <h2 class="text-white text-lg font-semibold">Shotscreen Options</h2>
        <button
          @click="toggleOverlay"
          class="rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white hover:bg-white/30"
        >
          Close
        </button>
      </div>

      <label class="text-xs uppercase tracking-wider text-white/80"
        >Website</label
      >
      <div class="mt-1 mb-3 flex gap-2">
        <input
          v-model="targetUrl"
          type="text"
          placeholder="https://example.com"
          class="w-full rounded-lg border border-white/30 bg-white/85 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
          @keyup.enter="visitUrl"
        />
        <button
          @click="visitUrl"
          class="rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600"
        >
          Visit
        </button>
      </div>

      <label class="text-xs uppercase tracking-wider text-white/80"
        >Resize</label
      >
      <div class="mt-1 mb-3 grid grid-cols-2 gap-2">
        <input
          v-model.number="windowWidth"
          type="number"
          min="400"
          placeholder="Width"
          class="rounded-lg border border-white/30 bg-white/85 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
        <input
          v-model.number="windowHeight"
          type="number"
          min="300"
          placeholder="Height"
          class="rounded-lg border border-white/30 bg-white/85 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      <button
        @click="applyWindowResize"
        class="mb-3 w-full rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-white"
      >
        Apply Resize
      </button>

      <button
        @click="takeScreenshot"
        class="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        Take Screenshot
      </button>

      <p v-if="statusMessage" class="mt-3 text-xs text-white/90 break-all">
        {{ statusMessage }}
      </p>

      <p class="mt-2 text-[11px] text-white/70">
        Shortcut: Ctrl/Cmd + Shift + O
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const browserView = ref(null);
const targetUrl = ref("https://halitsever.github.io/shotscreen-browser/");
const activeUrl = ref("https://halitsever.github.io/shotscreen-browser/");
const windowWidth = ref(1200);
const windowHeight = ref(800);
const statusMessage = ref("");
const isOverlayOpen = ref(true);
const isCapturingScreenshot = ref(false);
const overlayPosition = ref({ x: 24, y: 96 });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

const overlayStyle = computed(() => ({
  left: `${overlayPosition.value.x}px`,
  top: `${overlayPosition.value.y}px`,
}));

const normalizeUrl = (url) => {
  if (!url) {
    return null;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};

const visitUrl = () => {
  const normalizedUrl = normalizeUrl(targetUrl.value);
  if (!normalizedUrl) {
    alert("Please enter a valid URL");
    return;
  }

  activeUrl.value = normalizedUrl;
  targetUrl.value = normalizedUrl;
  statusMessage.value = "";
};

const applyWindowResize = () => {
  if (!windowWidth.value || !windowHeight.value) {
    alert("Please enter valid dimensions");
    return;
  }

  window.electronAPI.resizeWindow({
    width: windowWidth.value,
    height: windowHeight.value,
  });
};

const takeScreenshot = async () => {
  const wasOverlayOpen = isOverlayOpen.value;

  try {
    isCapturingScreenshot.value = true;
    isOverlayOpen.value = false;

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const result = await window.electronAPI.captureScreenshot();
    if (result?.canceled) {
      statusMessage.value = "Screenshot was canceled.";
      return;
    }

    statusMessage.value = `Saved: ${result.filePath}`;
  } catch (error) {
    statusMessage.value = "An error occurred while taking the screenshot.";
  } finally {
    isCapturingScreenshot.value = false;
    isOverlayOpen.value = wasOverlayOpen;
  }
};

const toggleOverlay = () => {
  isOverlayOpen.value = !isOverlayOpen.value;
};

const clampOverlayPosition = (x, y) => {
  const maxX = Math.max(8, window.innerWidth - 360 - 8);
  const maxY = Math.max(8, window.innerHeight - 120 - 8);

  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(8, y), maxY),
  };
};

const centerOverlay = () => {
  const panelWidth = 352;
  const panelHeight = 430;

  const centeredX = Math.round((window.innerWidth - panelWidth) / 2);
  const centeredY = Math.round((window.innerHeight - panelHeight) / 2);

  overlayPosition.value = clampOverlayPosition(centeredX, centeredY);
};

const startDragging = (event) => {
  isDragging.value = true;
  dragOffset.value = {
    x: event.clientX - overlayPosition.value.x,
    y: event.clientY - overlayPosition.value.y,
  };
};

const onMouseMove = (event) => {
  if (!isDragging.value) {
    return;
  }

  const nextPosition = clampOverlayPosition(
    event.clientX - dragOffset.value.x,
    event.clientY - dragOffset.value.y,
  );

  overlayPosition.value = nextPosition;
};

const stopDragging = () => {
  isDragging.value = false;
};

const onWindowKeyDown = (event) => {
  const isToggleShortcut =
    (event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "O";

  if (isToggleShortcut) {
    event.preventDefault();
    toggleOverlay();
  }
};

let removeToggleOverlayListener;

onMounted(() => {
  centerOverlay();

  browserView.value?.addEventListener("did-navigate", (event) => {
    targetUrl.value = event.url;
    activeUrl.value = event.url;
  });

  browserView.value?.addEventListener("did-navigate-in-page", (event) => {
    targetUrl.value = event.url;
    activeUrl.value = event.url;
  });

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", stopDragging);
  window.addEventListener("keydown", onWindowKeyDown);
  window.addEventListener("blur", stopDragging);

  removeToggleOverlayListener = window.electronAPI.onToggleOverlay(() => {
    toggleOverlay();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", stopDragging);
  window.removeEventListener("keydown", onWindowKeyDown);
  window.removeEventListener("blur", stopDragging);

  if (removeToggleOverlayListener) {
    removeToggleOverlayListener();
  }
});
</script>
