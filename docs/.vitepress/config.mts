import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Shotscreen Browser",
  description: "Shotscreen Browser - Frameless Browser For Screenshots, get cool web screenshots on macOS.",
  base: "/shotscreen/",
  themeConfig: {
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
