import { defineConfig } from "vitepress";

const site = "https://halitsever.github.io/shotscreen/";
const description = "Shotscreen Browser - Frameless Browser For Screenshots, get cool web screenshots on macOS.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Shotscreen Browser",
  description,
  url: site,
  image: `${site}og.png`,
  applicationCategory: "DesignApplication",
  operatingSystem: "macOS",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  downloadUrl: "https://github.com/halitsever/shotscreen/releases",
  codeRepository: "https://github.com/halitsever/shotscreen",
  programmingLanguage: ["Vue", "JavaScript"],
  license: "https://opensource.org/licenses/MIT",
  author: { "@type": "Person", name: "Halit Sever", url: "https://github.com/halitsever" },
};

export default defineConfig({
  lang: "en-US",
  title: "Shotscreen Browser",
  description,
  base: "/shotscreen/",
  sitemap: { hostname: site },
  head: [
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Shotscreen Browser" }],
    ["meta", { property: "og:image", content: `${site}og.png` }],
    ["meta", { property: "og:image:width", content: "1280" }],
    ["meta", { property: "og:image:height", content: "640" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["script", { type: "application/ld+json" }, JSON.stringify(jsonLd)],
  ],

  transformPageData(pageData) {
    const url = site + pageData.relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, ".html");
    const title = pageData.frontmatter.layout === "home" ? "Shotscreen Browser" : `${pageData.title} | Shotscreen Browser`;
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: pageData.frontmatter.description ?? description }],
    );
  },
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
