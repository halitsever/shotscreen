import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Shotscreen Browser",
  description: "Shotscreen Browser - Frameless Browser For Screenshots, get cool web screenshots on macOs.",
  base: "/shotscreen/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present Halit Sever",
    },

    nav: [
      { text: "Guide", link: "/" },
      { text: "Download", link: "/download" },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/halitsever/shotscreen" }],
  },
});
