<script setup lang="ts">
import { nextTick, ref } from "vue";

const ENDPOINT = "https://shotsnap.vercel.app/api/screenshot";
/** Mirrors the endpoint's Vercel firewall rule: 7 requests per 10 minutes per IP. */
const LIMIT = 7;
const WINDOW_MS = 10 * 60 * 1000;
const STORE_KEY = "shotscreen-online-requests";

const sizes = [
  { label: "Desktop 1440 x 900", w: 1440, h: 900 },
  { label: "MacBook Air 1280 x 800", w: 1280, h: 800 },
  { label: "iPad 820 x 1180", w: 820, h: 1180 },
  { label: "iPhone 15 393 x 852", w: 393, h: 852 },
];

const url = ref("");
const size = ref(1);
const state = ref<"idle" | "loading" | "done" | "error" | "limited" | "invalid">("idle");
const src = ref("");
const shotFor = ref("");
const waitMinutes = ref(0);
const loaded = ref("");
const shotWidth = ref(0);

/** Timestamps live in localStorage so a reload does not reset the local count; storage may be unavailable. */
function readTimes(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((t) => typeof t === "number" && Date.now() - t < WINDOW_MS) : [];
  } catch {
    return [];
  }
}
function writeTimes(times: number[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(times));
  } catch {}
}
const memTimes: number[] = [];
function recentTimes() {
  const stored = readTimes();
  const mem = memTimes.filter((t) => Date.now() - t < WINDOW_MS);
  return stored.length >= mem.length ? stored : mem;
}

function normalise(input: string): string | null {
  let value = input.trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = "https://" + value;
  try {
    const parsed = new URL(value);
    if (!/^https?:$/.test(parsed.protocol) || !parsed.hostname.includes(".")) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

function capture() {
  if (state.value === "loading") return;
  const page = normalise(url.value);
  if (!page) {
    state.value = "invalid";
    return;
  }
  const { w, h } = sizes[size.value];
  const next = `${ENDPOINT}?page=${encodeURIComponent(page)}&width=${w}&height=${h}`;
  /** The image on screen already is this capture, so no request is needed. */
  if (next === loaded.value) {
    state.value = "done";
    return;
  }
  const times = recentTimes();
  if (times.length >= LIMIT) {
    waitMinutes.value = Math.max(1, Math.ceil((times[0] + WINDOW_MS - Date.now()) / 60000));
    state.value = "limited";
    return;
  }
  times.push(Date.now());
  memTimes.push(Date.now());
  writeTimes(times);
  shotFor.value = page;
  shotWidth.value = w;
  state.value = "loading";
  loaded.value = "";
  /** Clearing first makes a retry of the same URL load again instead of waiting for an event that never fires. */
  src.value = "";
  nextTick(() => (src.value = next));
}

function onLoad() {
  loaded.value = src.value;
  if (state.value === "loading") state.value = "done";
}
function onError() {
  if (state.value === "loading") state.value = "error";
}
</script>

<template>
  <div class="shot-tool">
    <form class="shot-form" @submit.prevent="capture">
      <label class="shot-label" for="shot-url">Website URL</label>
      <div class="shot-row">
        <input id="shot-url" v-model="url" class="shot-input" type="text" inputmode="url" autocomplete="url" spellcheck="false" placeholder="example.com" />
        <select v-model.number="size" class="shot-select" aria-label="Viewport size">
          <option v-for="(s, i) in sizes" :key="s.label" :value="i">{{ s.label }}</option>
        </select>
        <button class="shot-button" type="submit" :disabled="state === 'loading'">{{ state === "loading" ? "Capturing..." : "Take screenshot" }}</button>
      </div>
      <p class="shot-note">One click sends one request to the free shared shotsnap endpoint. It allows 7 requests per 10 minutes per IP address, about 1,000 a day.</p>
    </form>

    <div class="shot-status" role="status" aria-live="polite">
      <p v-if="state === 'loading'">Rendering {{ shotFor }} in a cloud browser. This usually takes a few seconds.</p>
      <p v-else-if="state === 'invalid'" class="shot-warn">Enter a full web address, for example https://example.com.</p>
      <p v-else-if="state === 'limited'" class="shot-warn">
        This browser has sent 7 requests in the last 10 minutes, which is the endpoint's limit per IP address. It would answer HTTP 429 (Too Many Requests) now, so no request was
        sent. Try again in about {{ waitMinutes }} {{ waitMinutes === 1 ? "minute" : "minutes" }}.
      </p>
      <div v-else-if="state === 'error'" class="shot-warn">
        <p>No screenshot came back for {{ shotFor }}.</p>
        <p>
          If this IP address has made more than 7 requests in 10 minutes, from this page or any other client, the endpoint answers HTTP 429 (Too Many Requests) until the window
          passes. Wait a few minutes and try once more. Otherwise the site may be unreachable, may block cloud browsers, or the free endpoint may be down: it has no uptime
          guarantee.
        </p>
      </div>
    </div>

    <figure v-show="src && state !== 'error'" class="shot-result">
      <img v-if="src" :src="src" :style="{ width: shotWidth + 'px' }" :alt="`Screenshot of ${shotFor}`" referrerpolicy="no-referrer" @load="onLoad" @error="onError" />
      <figcaption v-if="state === 'done'">PNG at twice the chosen viewport size. Right-click or long-press the image to save it.</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.shot-tool {
  margin: 24px 0 8px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.shot-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}
.shot-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.shot-input,
.shot-select {
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 15px;
}
.shot-input {
  flex: 1 1 180px;
}
.shot-select {
  flex: 0 1 200px;
}
.shot-input:focus,
.shot-select:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}
.shot-button {
  flex: 0 0 auto;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  font-weight: 600;
  font-size: 15px;
}
.shot-button:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}
.shot-button:disabled {
  opacity: 0.7;
  cursor: progress;
}
.shot-note {
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.shot-status p {
  margin: 12px 0 0;
}
.shot-warn {
  color: var(--vp-c-warning-1);
}
.shot-result {
  margin: 16px 0 0;
}
.shot-result img {
  display: block;
  max-width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.shot-result figcaption {
  margin-top: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
@media (max-width: 480px) {
  .shot-select,
  .shot-button {
    flex: 1 1 100%;
  }
}
</style>
