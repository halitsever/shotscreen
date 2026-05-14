<template>
  <div class="window" :data-stage="prefs.stageBg" :style="{ '--accent': prefs.accent }" @click="handleWindowClick">
    <!-- stage -->
    <div class="stage" ref="stageRef">
      <div class="stage-bg" />
      <div class="stage-content" :style="{ transform: `scale(${scale})` }">
        <div class="frm" :data-style="prefs.frameStyle" :style="{ width: vp.w + 'px', height: vp.h + 'px' }">
          <div class="frm-inner">
            <webview ref="webviewRef" :src="url" allowpopups style="flex: 1; width: 100%; min-height: 0" />
          </div>
          <div v-if="countdown > 0" class="frm-countdown">{{ countdown }}</div>
          <div v-if="loading" class="frm-load">
            <span />
          </div>
          <div v-if="flash" class="frm-flash" />
        </div>
      </div>
    </div>

    <!-- address bar -->
    <form class="top-pill" @submit.prevent="commitUrl" @click.stop>
      <span class="lock">
        <span v-if="loading" class="spinner" />
        <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </span>
      <input v-if="editingUrl" ref="urlInputRef" v-model="urlDraft" spellcheck="false" @blur="cancelUrlEdit" @keydown.escape.prevent="cancelUrlEdit" />
      <button v-else type="button" class="url" @click="startUrlEdit">
        <span class="host">{{ parsedUrl.host }}</span>
        <span class="path">{{ parsedUrl.path }}</span>
      </button>
      <button type="button" class="x" @click.stop="clearUrl">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M6 6l12 12M18 6l-12 12" />
        </svg>
      </button>
    </form>

    <!-- top right -->
    <div class="corner corner-tr">
      <div class="hist-wrap">
        <button :class="['ico-btn', showHist && 'on']" @click.stop="toggleHist" title="Recent shots">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
            <path d="M12 8v5l3 2" />
          </svg>
          <span class="ico-badge">{{ shots.length }}</span>
        </button>
        <div v-if="showHist" class="hist-pop" @click.stop>
          <div class="hist-h">
            <span>Recent Shots</span>
            <button @click="clearShots">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M9 7V4h6v3" />
              </svg>
            </button>
          </div>
          <div class="hist-list">
            <p v-if="shots.length === 0" class="hist-empty">No shots yet</p>
            <div v-for="s in shots" :key="s.id" class="hist-row">
              <div class="hist-th" :style="{ background: s.color }" />
              <div class="hist-meta">
                <div class="hist-name">{{ s.name }}</div>
                <div class="hist-at">{{ relativeTime(s.timestamp) }} · {{ s.w }}×{{ s.h }}</div>
              </div>
              <button class="hist-act" title="Copy path" @click.stop="copyPath(s.filePath)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- status -->
    <div class="corner corner-bl">
      <div class="status">
        <span class="status-dot" />
        <span
          ><b>{{ vp.label }}</b></span
        >
        <span class="status-sep">·</span>
        <span>{{ vp.w }} × {{ vp.h }}</span>
        <span class="status-sep">·</span>
        <span>{{ opts.format }} @{{ opts.dpr }}×</span>
      </div>
    </div>

    <!-- shortcut hint -->
    <div v-if="prefs.showCommandHint" class="corner corner-br">
      <div class="hint">
        <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd>
        <span>Capture</span>
      </div>
    </div>

    <!-- dock -->
    <div :class="['dock', !prefs.dockExpanded && 'compact']">
      <div class="dock-grp">
        <button class="dock-icon" data-tooltip="Go back" :disabled="!canGoBack" @click="goBack">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button class="dock-icon" data-tooltip="Reload page" @click="reload">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      </div>

      <div ref="vpMenuRef" style="position: relative">
        <button class="dock-b dock-b-pill" @click.stop="showVpMenu = !showVpMenu">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="vp.icon === 'phone'">
              <rect x="7" y="3" width="10" height="18" rx="2" />
              <path d="M11 18h2" />
            </template>
            <template v-else-if="vp.icon === 'tablet'">
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <path d="M11 18h2" />
            </template>
            <template v-else-if="vp.icon === 'wide'">
              <rect x="2" y="6" width="20" height="12" rx="2" />
            </template>
            <template v-else-if="vp.icon === 'ruler'">
              <path d="M3 14l7-11 11 7-7 11z" />
              <path d="M7 9l1.5 1M10 7l2 1.5M13 5l1.5 1" />
            </template>
            <template v-else>
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <path d="M9 20h6M12 16v4" />
            </template>
          </svg>
          <span class="lbl">{{ vp.label }}</span>
          <span class="dim">{{ vp.w }}×{{ vp.h }}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <div v-if="showVpMenu" class="pop" @click.stop>
          <div class="pop-h">Devices</div>
          <button v-for="v in VIEWPORTS" :key="v.id" :class="['pop-row', vpId === v.id && 'on']" @click="selectViewport(v.id)">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="flex-shrink: 0"
            >
              <template v-if="v.icon === 'phone'">
                <rect x="7" y="3" width="10" height="18" rx="2" />
                <path d="M11 18h2" />
              </template>
              <template v-else-if="v.icon === 'tablet'">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M11 18h2" />
              </template>
              <template v-else-if="v.icon === 'wide'">
                <rect x="2" y="6" width="20" height="12" rx="2" />
              </template>
              <template v-else>
                <rect x="3" y="4" width="18" height="12" rx="2" />
                <path d="M9 20h6M12 16v4" />
              </template>
            </svg>
            <span class="pop-row-l">{{ v.label }}</span>
            <span class="pop-row-d">{{ v.w }} × {{ v.h }}</span>
            <svg
              v-if="vpId === v.id"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          </button>
          <div class="pop-divider" />
          <div class="pop-h">Custom</div>
          <div class="pop-custom">
            <input type="number" v-model.number="custom.w" />
            <span>×</span>
            <input type="number" v-model.number="custom.h" />
            <button @click="selectViewport('custom')">Use</button>
          </div>
        </div>
      </div>

      <div class="dock-grp dock-seg">
        <button v-for="m in MODES" :key="m.id" :class="['dock-icon', mode === m.id && 'on']" :data-tooltip="m.tip" @click="selectMode(m.id)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="m.icon === 'monitor'">
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <path d="M9 20h6M12 16v4" />
            </template>
            <template v-else-if="m.icon === 'fullpage'">
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <path d="M9 8h6M9 12h6M9 16h4" />
            </template>
            <template v-else>
              <path d="M3 7l9-4 9 4-9 4z" />
              <path d="M3 12l9 4 9-4" />
            </template>
          </svg>
        </button>
      </div>

      <div class="dock-grp">
        <button
          :class="['dock-icon', opts.delay > 0 && 'on']"
          :data-tooltip="opts.delay > 0 ? `Capture delay: ${opts.delay}s` : 'Capture delay — click to set'"
          @click="cycleDelay"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2.5" />
            <path d="M9 3h6" />
          </svg>
          <span v-if="opts.delay > 0" class="dock-icon-num">{{ opts.delay }}</span>
        </button>
        <button :class="['dock-icon', opts.dark && 'on']" data-tooltip="Force dark mode on page" @click="toggleDark">
          <svg v-if="opts.dark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </button>
        <button :class="['dock-icon', opts.roundCorners && 'on']" data-tooltip="Round screenshot corners" @click="opts.roundCorners = !opts.roundCorners">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9V6a3 3 0 0 1 3-3h3" />
            <path d="M15 3h3a3 3 0 0 1 3 3v3" />
            <path d="M21 15v3a3 3 0 0 1-3 3h-3" />
            <path d="M9 21H6a3 3 0 0 1-3-3v-3" />
          </svg>
        </button>
        <button :class="['dock-icon', opts.hideCookies && 'on']" data-tooltip="Hide cookie banners" @click="toggleCookies">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a9 9 0 1 0 9 9c-2.5 0-5-1-5-4 0-3-3-3-4-5z" />
            <circle cx="9" cy="11" r=".8" fill="currentColor" />
            <circle cx="13" cy="14" r=".8" fill="currentColor" />
            <circle cx="15" cy="9" r=".8" fill="currentColor" />
          </svg>
        </button>
      </div>

      <button class="cap-btn" @click="handleCapture">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 8h3l2-2h4l2 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
        <span>{{ prefs.captureLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue";

const VIEWPORTS = [
  { id: "iphone", label: "iPhone 15", w: 393, h: 852, icon: "phone" },
  {
    id: "iphone-pro",
    label: "iPhone 15 Pro Max",
    w: 430,
    h: 932,
    icon: "phone",
  },
  { id: "ipad", label: "iPad", w: 820, h: 1180, icon: "tablet" },
  { id: "ipad-pro", label: "iPad Pro 13″", w: 1024, h: 1366, icon: "tablet" },
  { id: "macbook", label: "MacBook Air", w: 1280, h: 800, icon: "monitor" },
  { id: "desktop", label: "Desktop", w: 1440, h: 900, icon: "monitor" },
  { id: "wide", label: "Ultrawide", w: 1920, h: 1080, icon: "wide" },
];

const MODES = [
  {
    id: "viewport",
    label: "Viewport",
    icon: "monitor",
    tip: "Viewport — visible area only",
  },
  {
    id: "fullpage",
    label: "Full Page",
    icon: "fullpage",
    tip: "Full Page — entire scroll height",
  },
];

const THUMB_COLORS = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
];

const FRAME_RADIUS = { soft: 8, lifted: 14, sharp: 0 };

const prefs = reactive({
  accent: "#FF453A",
  stageBg: "studio",
  frameStyle: "soft",
  dockExpanded: true,
  showCommandHint: true,
  captureLabel: "Capture",
});

const url = ref("https://halitsever.github.io/shotscreen/");
const vpId = ref("macbook");
const custom = reactive({ w: 1280, h: 800 });
const mode = ref("viewport");
const loading = ref(false);
const flash = ref(false);
const countdown = ref(0);
const nowTick = ref(Date.now());
const canGoBack = ref(false);
const showHist = ref(false);
const showVpMenu = ref(false);
const editingUrl = ref(false);
const urlDraft = ref("");
const opts = reactive({
  delay: 0,
  hideCookies: true,
  hideStickies: false,
  dark: false,
  noAnim: true,
  format: "PNG",
  dpr: 2,
  roundCorners: true,
});
const shots = ref([]);
const stageSize = reactive({ w: window.innerWidth, h: window.innerHeight });

const stageRef = ref(null);
const webviewRef = ref(null);
const urlInputRef = ref(null);
const vpMenuRef = ref(null);

const vp = computed(() => {
  if (vpId.value === "custom") {
    return { w: custom.w, h: custom.h, label: "Custom", icon: "ruler" };
  }
  return VIEWPORTS.find((v) => v.id === vpId.value) ?? VIEWPORTS[4];
});

const scale = computed(() => {
  const padX = 80,
    padY = 180;
  return Math.min(1, (stageSize.w - padX * 2) / vp.value.w, (stageSize.h - padY) / vp.value.h);
});

const parsedUrl = computed(() => {
  try {
    const u = new URL(url.value.startsWith("http") ? url.value : `https://${url.value}`);
    return {
      host: u.hostname.replace(/^www\./, ""),
      path: u.pathname === "/" ? "" : u.pathname,
    };
  } catch {
    return { host: url.value, path: "" };
  }
});

const startUrlEdit = () => {
  urlDraft.value = url.value;
  editingUrl.value = true;
  nextTick(() => urlInputRef.value?.select());
};

const commitUrl = () => {
  if (!urlDraft.value.trim()) return;
  const normalized = urlDraft.value.startsWith("http") ? urlDraft.value : `https://${urlDraft.value}`;
  url.value = normalized;
  editingUrl.value = false;
};

const cancelUrlEdit = () => {
  editingUrl.value = false;
};
const clearUrl = () => {
  url.value = "about:blank";
};

const goBack = () => webviewRef.value?.goBack();
const reload = () => webviewRef.value?.reload();

const toggleHist = () => {
  showHist.value = !showHist.value;
};
const clearShots = () => {
  shots.value.splice(0);
};

const relativeTime = (ts) => {
  const d = nowTick.value - ts;
  if (d < 60_000) return "just now";
  if (d < 3_600_000) return `${Math.floor(d / 60_000)}m ago`;
  return `${Math.floor(d / 3_600_000)}h ago`;
};

const copyPath = async (filePath) => {
  if (filePath) await navigator.clipboard.writeText(filePath);
};

const handleWindowClick = (e) => {
  if (vpMenuRef.value && !vpMenuRef.value.contains(e.target)) {
    showVpMenu.value = false;
  }
  if (showHist.value) {
    showHist.value = false;
  }
};

const selectViewport = (id) => {
  vpId.value = id;
  showVpMenu.value = false;
};

const DARK_CSS = `
  html { filter: invert(90%) hue-rotate(180deg) !important; background: #111 !important; }
  img, video, canvas, svg, picture, [style*="background-image"] { filter: invert(110%) hue-rotate(180deg) !important; }
`.trim();

const COOKIE_SEL =
  '[class*="cookie" i],[id*="cookie" i],[class*="consent" i],[id*="consent" i],[class*="gdpr" i],[id*="gdpr" i],[aria-label*="cookie" i],[aria-label*="consent" i],.cc-window,#onetrust-consent-sdk';

const toggleDark = async () => {
  opts.dark = !opts.dark;
  const wv = webviewRef.value;
  if (!wv) return;
  try {
    if (opts.dark) {
      await wv.executeJavaScript(`(() => {
        if (document.getElementById('__ss_dark__')) return;
        const s = document.createElement('style');
        s.id = '__ss_dark__';
        s.textContent = ${JSON.stringify(DARK_CSS)};
        document.head.appendChild(s);
      })()`);
    } else {
      await wv.executeJavaScript(`document.getElementById('__ss_dark__')?.remove()`);
    }
  } catch (e) {
    console.error("Dark toggle failed:", e);
  }
};

const toggleCookies = async () => {
  opts.hideCookies = !opts.hideCookies;
  const wv = webviewRef.value;
  if (!wv) return;
  try {
    if (opts.hideCookies) {
      await wv.executeJavaScript(`(() => {
        document.querySelectorAll(${JSON.stringify(COOKIE_SEL)}).forEach(el => {
          el.dataset.ssWas = el.style.display;
          el.style.setProperty('display', 'none', 'important');
        });
      })()`);
    } else {
      await wv.executeJavaScript(`(() => {
        document.querySelectorAll(${JSON.stringify(COOKIE_SEL)}).forEach(el => {
          el.style.display = el.dataset.ssWas ?? '';
          delete el.dataset.ssWas;
        });
      })()`);
    }
  } catch (e) {
    console.error("Cookie toggle failed:", e);
  }
};
const selectMode = (id) => {
  mode.value = id;
};

const cycleDelay = () => {
  const next = { 0: 3, 3: 5, 5: 10, 10: 0 };
  opts.delay = next[opts.delay] ?? 0;
};

const applyBorderRadius = (base64, mime, radius) => {
  if (radius === 0 || mime === "jpeg") return Promise.resolve(base64);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      const r = radius, w = img.width, h = img.height;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(w - r, 0);
      ctx.arcTo(w, 0, w, r, r);
      ctx.lineTo(w, h - r);
      ctx.arcTo(w, h, w - r, h, r);
      ctx.lineTo(r, h);
      ctx.arcTo(0, h, 0, h - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL(`image/${mime}`, 0.92).replace(/^data:image\/[^;]+;base64,/, ""));
    };
    img.src = `data:image/${mime};base64,${base64}`;
  });
};

const handleCapture = async () => {
  const wv = webviewRef.value;
  if (!wv) return;

  // element pick must happen before countdown so ESC doesn't conflict with the UI
  if (opts.delay > 0) {
    for (let i = opts.delay; i > 0; i--) {
      countdown.value = i;
      await new Promise((r) => setTimeout(r, 1000));
    }
    countdown.value = 0;
  }

  flash.value = true;
  setTimeout(() => {
    flash.value = false;
  }, 380);

  try {
    if (opts.noAnim) {
      await wv.executeJavaScript(`(() => {
        if (document.getElementById('__ss_no_anim__')) return;
        const s = document.createElement('style');
        s.id = '__ss_no_anim__';
        s.textContent = '*, *::before, *::after { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }';
        document.head.appendChild(s);
      })()`);
    }
    if (opts.dark) {
      await wv.executeJavaScript(`(() => {
        if (document.getElementById('__ss_dark__')) return;
        const s = document.createElement('style');
        s.id = '__ss_dark__';
        s.textContent = ${JSON.stringify(DARK_CSS)};
        document.head.appendChild(s);
      })()`);
    }
    if (opts.hideCookies) {
      await wv.executeJavaScript(`(() => {
        document.querySelectorAll(${JSON.stringify(COOKIE_SEL)}).forEach(el => el.style.setProperty('display', 'none', 'important'));
      })()`);
    }

    // expand webview to full doc height so capturePage() gets everything, then restore
    let restoreFullPage = null;
    if (mode.value === "fullpage") {
      const dims = await wv.executeJavaScript(`({
        w: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0),
        h: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)
      })`);
      const origFlex = wv.style.flex;
      const origH = wv.style.height;
      wv.style.flex = "none";
      wv.style.height = dims.h + "px";
      await new Promise((r) => setTimeout(r, 300));
      restoreFullPage = () => {
        wv.style.flex = origFlex;
        wv.style.height = origH;
      };
    }

    const raw = await window.electronAPI.captureWebview({
      format: opts.format,
      dpr: opts.dpr,
    });

    restoreFullPage?.();

    const fmt = opts.format.toLowerCase();
    const mime = fmt === "jpg" ? "jpeg" : fmt;
    const radius = opts.roundCorners ? (FRAME_RADIUS[prefs.frameStyle] ?? 8) * opts.dpr : 0;
    const finalRaw = await applyBorderRadius(raw, mime, radius);
    const result = await window.electronAPI.saveScreenshot(`data:image/${mime};base64,${finalRaw}`, { format: opts.format });

    if (!result.canceled) {
      const name = (() => {
        try {
          const u = new URL(url.value);
          return u.hostname.replace(/^www\./, "") + (u.pathname === "/" ? "" : u.pathname);
        } catch {
          return url.value;
        }
      })();
      shots.value.unshift({
        id: Date.now(),
        timestamp: Date.now(),
        name,
        w: vp.value.w,
        h: vp.value.h,
        color: THUMB_COLORS[Math.floor(Math.random() * THUMB_COLORS.length)],
        filePath: result.filePath,
      });
    }
  } catch (err) {
    console.error("Capture failed:", err);
  }
};

let ro = null;
let tickTimer = null;

onMounted(() => {
  tickTimer = setInterval(() => {
    nowTick.value = Date.now();
  }, 30_000);
  ro = new ResizeObserver(([entry]) => {
    stageSize.w = entry.contentRect.width;
    stageSize.h = entry.contentRect.height;
  });
  if (stageRef.value) ro.observe(stageRef.value);

  const wv = webviewRef.value;
  if (wv) {
    wv.addEventListener("dom-ready", () => {
      window.electronAPI.registerWebview(wv.getWebContentsId());
      canGoBack.value = wv.canGoBack();
    });
    wv.addEventListener("did-navigate", (e) => {
      url.value = e.url;
      canGoBack.value = wv.canGoBack();
    });
    wv.addEventListener("did-navigate-in-page", (e) => {
      url.value = e.url;
      canGoBack.value = wv.canGoBack();
    });
    wv.addEventListener("did-start-loading", () => {
      loading.value = true;
    });
    wv.addEventListener("did-stop-loading", () => {
      loading.value = false;
    });
  }

  window.electronAPI.onTriggerCapture(() => handleCapture());
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  ro?.disconnect();
  clearInterval(tickTimer);
  window.removeEventListener("keydown", onKeydown);
});

const onKeydown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    handleCapture();
  }
};
</script>

<style>
.window {
  width: 100%;
  height: 100vh;
  background: #1a1a1d;
  position: relative;
  overflow: hidden;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
  -webkit-app-region: drag;
  user-select: none;
}

.window button,
.window input {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.window input {
  outline: none;
}

.window kbd {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 10.5px;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  margin: 0 1px;
}

/* stage */
.stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.stage-bg {
  position: absolute;
  inset: 0;
}
.window[data-stage="studio"] .stage-bg {
  background: radial-gradient(900px 700px at 50% 30%, #2c2c33 0%, #15151a 65%);
}
.window[data-stage="studio"] .stage-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: 0.5;
}
.window[data-stage="void"] .stage-bg {
  background: #050506;
}
.window[data-stage="mesh"] .stage-bg {
  background:
    radial-gradient(600px 400px at 25% 25%, #4a3370 0%, transparent 60%), radial-gradient(700px 500px at 75% 70%, #2a4d7a 0%, transparent 60%),
    radial-gradient(500px 300px at 50% 50%, #1a3a3a 0%, transparent 60%), #0a0a0e;
}
.window[data-stage="sand"] .stage-bg {
  background: radial-gradient(900px 700px at 50% 30%, #6b5a45 0%, #2a2218 65%);
}

.stage-content {
  position: relative;
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-app-region: no-drag;
}

/* frame */
.frm {
  background: white;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.frm[data-style="soft"] {
  border-radius: 8px;
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.08),
    0 30px 80px rgba(0, 0, 0, 0.55),
    0 12px 32px rgba(0, 0, 0, 0.35);
}
.frm[data-style="lifted"] {
  border-radius: 14px;
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.1),
    0 50px 120px -20px rgba(0, 0, 0, 0.7),
    0 20px 50px -10px rgba(0, 0, 0, 0.45);
}
.frm[data-style="sharp"] {
  border-radius: 0;
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.12),
    0 30px 80px rgba(0, 0, 0, 0.55);
}
.frm-inner {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
}
.frm-load {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.frm-load > span {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.frm-flash {
  position: absolute;
  inset: 0;
  background: white;
  animation: flash 0.4s ease-out forwards;
  pointer-events: none;
}
.frm-countdown {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 96px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.04em;
  background: rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  z-index: 2;
  pointer-events: none;
}
@keyframes flash {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* corners */
.corner {
  position: absolute;
  z-index: 5;
  -webkit-app-region: no-drag;
}
.corner-tl {
  top: 18px;
  left: 18px;
}
.corner-tr {
  top: 18px;
  right: 18px;
  display: flex;
  gap: 8px;
}
.corner-bl {
  bottom: 22px;
  left: 22px;
}
.corner-br {
  bottom: 26px;
  right: 22px;
}

/* address bar */
.top-pill {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(28, 28, 32, 0.7);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  padding: 5px 5px 5px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.9);
  z-index: 5;
  min-width: 320px;
  max-width: 540px;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.35),
    0 0 0 0.5px rgba(255, 255, 255, 0.05) inset;
  -webkit-app-region: no-drag;
}
.top-pill .lock {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}
.top-pill .spinner {
  width: 12px;
  height: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.top-pill .url {
  flex: 1;
  text-align: left;
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.12s;
}
.top-pill .url:hover {
  background: rgba(255, 255, 255, 0.06);
}
.top-pill .host {
  color: white;
}
.top-pill .path {
  color: rgba(255, 255, 255, 0.5);
}
.top-pill input {
  flex: 1;
  font-size: 12.5px;
  letter-spacing: -0.01em;
  color: white;
  padding: 4px 6px;
}
.top-pill .x {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
  transition:
    background 0.12s,
    color 0.12s;
}
.top-pill .x:hover {
  background: rgba(255, 255, 255, 0.16);
  color: white;
}

/* icon buttons */
.ico-btn {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(28, 28, 32, 0.7);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  position: relative;
  transition:
    background 0.12s,
    color 0.12s;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
.ico-btn:hover {
  background: rgba(40, 40, 44, 0.85);
  color: white;
}
.ico-btn.on {
  background: rgba(255, 255, 255, 0.16);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}
.ico-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #1a1a1d;
}
.hist-wrap {
  position: relative;
}

/* popovers */
.hist-pop {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: rgba(28, 28, 32, 0.85);
  backdrop-filter: blur(36px) saturate(180%);
  -webkit-backdrop-filter: blur(36px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.5),
    0 0 0 0.5px rgba(255, 255, 255, 0.05) inset;
  padding: 6px;
  z-index: 10;
  color: white;
  -webkit-app-region: no-drag;
  cursor: default;
}

.hist-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
}
.hist-h button {
  color: rgba(255, 255, 255, 0.5);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
}
.hist-h button:hover {
  color: white;
  background: rgba(255, 255, 255, 0.08);
}
.hist-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.hist-empty {
  padding: 12px 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
}
.hist-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 8px;
  text-align: left;
  transition: background 0.1s;
}
.hist-row:hover {
  background: rgba(255, 255, 255, 0.06);
}
.hist-th {
  width: 40px;
  height: 28px;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1);
}
.hist-meta {
  flex: 1;
  min-width: 0;
}
.hist-name {
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hist-at {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
}
.hist-act {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transition:
    opacity 0.12s,
    background 0.12s;
}
.hist-row:hover .hist-act {
  opacity: 1;
}
.hist-act:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* status */
.status {
  background: rgba(28, 28, 32, 0.7);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 9px;
  padding: 7px 11px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.85);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.005em;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
.status b {
  color: white;
  font-weight: 600;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34c759;
  box-shadow: 0 0 6px rgba(52, 199, 89, 0.6);
  flex-shrink: 0;
}
.status-sep {
  color: rgba(255, 255, 255, 0.3);
}

/* shortcut hint */
.hint {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.005em;
}
.hint kbd {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.65);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  font-size: 10.5px;
  padding: 2px 5px;
  min-width: 18px;
  text-align: center;
}
.hint span {
  margin-left: 4px;
}

/* dock */
.dock {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 20, 24, 0.78);
  backdrop-filter: blur(36px) saturate(200%);
  -webkit-backdrop-filter: blur(36px) saturate(200%);
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.5),
    0 8px 20px rgba(0, 0, 0, 0.3),
    0 0 0 0.5px rgba(255, 255, 255, 0.06) inset;
  z-index: 6;
  -webkit-app-region: no-drag;
  white-space: nowrap;
}
.dock-grp {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 4px;
  position: relative;
}
.dock-grp + .dock-grp::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 0.5px;
  background: rgba(255, 255, 255, 0.12);
}
.dock-seg {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 3px;
  margin: 0 2px;
  gap: 1px;
}
.dock-seg::before {
  display: none;
}
.dock-icon,
.dock-b {
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  transition:
    background 0.12s,
    color 0.12s;
  position: relative;
  font-weight: 500;
}
.dock-icon {
  width: 36px;
}
.dock-icon:disabled {
  color: rgba(255, 255, 255, 0.25);
  cursor: default;
}
.dock-icon:hover:not(:disabled),
.dock-b:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}
.dock-icon.on,
.dock-b.on {
  background: rgba(255, 255, 255, 0.16);
  color: white;
  box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1) inset;
}
.dock-seg .dock-icon {
  height: 30px;
  width: 32px;
  border-radius: 7px;
}
.dock-seg .dock-icon.on {
  background: white;
  color: #1a1a1d;
  box-shadow: none;
}
.dock-icon-num {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 8.5px;
  font-weight: 700;
  background: var(--accent);
  color: white;
  border-radius: 4px;
  padding: 1px 3px;
  line-height: 1;
}
/* tooltip */
.dock [data-tooltip] {
  overflow: visible;
}
.dock [data-tooltip]::before,
.dock [data-tooltip]::after {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.12s;
  transition-delay: 0s;
}
.dock [data-tooltip]:hover::before,
.dock [data-tooltip]:hover::after {
  opacity: 1;
  transition-delay: 0.5s;
}
.dock [data-tooltip]::after {
  content: attr(data-tooltip);
  bottom: calc(100% + 10px);
  background: rgba(18, 18, 22, 0.97);
  color: rgba(255, 255, 255, 0.88);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  padding: 5px 9px;
  border-radius: 7px;
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  z-index: 200;
  letter-spacing: 0.01em;
}
.dock [data-tooltip]::before {
  content: "";
  bottom: calc(100% + 5px);
  width: 7px;
  height: 7px;
  background: rgba(18, 18, 22, 0.97);
  border-right: 0.5px solid rgba(255, 255, 255, 0.12);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.12);
  transform: translateX(-50%) rotate(45deg);
  z-index: 201;
}

.dock-b-pill {
  height: 36px;
  padding: 0 16px 0 12px;
  gap: 10px;
  letter-spacing: -0.01em;
  font-size: 12.5px;
}
.dock-b-pill .lbl {
  font-weight: 500;
  color: white;
}
.dock-b-pill .dim {
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  font-weight: 400;
}
button.cap-btn {
  height: 36px;
  padding: 0 18px 0 14px;
  border-radius: 10px;
  background: #ff453a;
  color: white;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: -0.01em;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-left: 4px;
  box-shadow:
    0 8px 24px rgba(255, 69, 58, 0.5),
    0 0 0 0.5px rgba(255, 255, 255, 0.18) inset,
    0 0.5px 0 rgba(255, 255, 255, 0.3) inset;
  transition:
    filter 0.12s,
    transform 0.04s;
  white-space: nowrap;
}
button.cap-btn:hover {
  filter: brightness(1.08);
}
button.cap-btn:active {
  transform: translateY(0.5px);
  filter: brightness(0.95);
}

.dock.compact .dock-b-pill .lbl,
.dock.compact .dock-b-pill .dim,
.dock.compact .cap-btn span {
  display: none;
}
.dock.compact .dock-b-pill {
  padding: 0 10px;
}
.dock.compact .cap-btn {
  padding: 0 12px;
}

/* viewport popover */
.pop {
  position: absolute;
  bottom: calc(100% + 10px);
  left: -12px;
  min-width: 280px;
  background: rgba(28, 28, 32, 0.85);
  backdrop-filter: blur(36px) saturate(180%);
  -webkit-backdrop-filter: blur(36px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.5),
    0 0 0 0.5px rgba(255, 255, 255, 0.05) inset;
  padding: 8px;
  z-index: 10;
}
.pop-h {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
  padding: 10px 14px 8px;
}
.pop-row {
  width: 100%;
  height: 38px;
  padding: 0 14px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 13px;
  letter-spacing: -0.01em;
  text-align: left;
  transition: background 0.1s;
}
.pop-row:hover {
  background: var(--accent);
}
.pop-row:hover .pop-row-d {
  color: rgba(255, 255, 255, 0.85);
}
.pop-row.on .pop-row-l {
  font-weight: 500;
}
.pop-row-l {
  flex: 1;
}
.pop-row-d {
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
}
.pop-divider {
  height: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  margin: 5px 0;
}
.pop-custom {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px 6px;
}
.pop-custom input {
  width: 60px;
  height: 24px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 0.5px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 5px;
  color: white;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
}
.pop-custom > span {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}
.pop-custom > button {
  margin-left: auto;
  height: 24px;
  padding: 0 10px;
  border-radius: 5px;
  background: var(--accent);
  color: white;
  font-weight: 500;
  font-size: 12px;
}
</style>
