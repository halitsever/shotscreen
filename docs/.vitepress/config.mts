import { defineConfig } from "vitepress";

const site = "https://projects.halit.org/shotscreen/";
const description = "Shotscreen Browser is a free, frameless browser for taking clean website screenshots on Mac, with viewport presets and full-page capture.";

const license = "https://opensource.org/licenses/MIT";
const author = { "@type": "Person", name: "Halit Sever", url: "https://github.com/halitsever" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareSourceCode",
      "@id": `${site}#source`,
      name: "Shotscreen Browser",
      description,
      url: site,
      image: `${site}og.png`,
      codeRepository: "https://github.com/halitsever/shotscreen",
      programmingLanguage: ["Vue", "JavaScript"],
      license,
      author,
    },
  ],
};

/** FAQPage data for the questions a page shows in its FAQ section. */
function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>|`/g, "") },
    })),
  };
}

/** BlogPosting, breadcrumbs and, when the post shows an FAQ, FAQPage data for a blog post. */
function postJsonLd(fm: Record<string, any>, url: string) {
  const person = { ...author, url: "https://halit.org" };
  const graph: object[] = [
    {
      "@type": "BlogPosting",
      headline: fm.headline ?? fm.title,
      description: fm.description,
      url,
      mainEntityOfPage: url,
      datePublished: fm.date,
      dateModified: fm.date,
      inLanguage: "en",
      image: `${site}og.png`,
      keywords: fm.keyword,
      author: person,
      publisher: person,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Shotscreen Browser", item: site },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${site}blog/` },
        { "@type": "ListItem", position: 3, name: fm.headline ?? fm.title, item: url },
      ],
    },
  ];
  if (fm.faq?.length) graph.push(faqJsonLd(fm.faq));
  return { "@context": "https://schema.org", "@graph": graph };
}

export default defineConfig({
  /** keeps the page hash map out of every page's HTML, which Semrush reads as a low text-to-HTML ratio */
  metaChunk: true,
  lang: "en-US",
  title: "Shotscreen Browser",
  description,
  base: "/shotscreen/",
  sitemap: { hostname: site },
  head: [
    /** Cloudflare Web Analytics, one token for every page on projects.halit.org. */
    ["script", { defer: "", src: "https://static.cloudflareinsights.com/beacon.min.js", "data-cf-beacon": '{"token": "dd7e54d3f48841c187d72d9dbb92a6b6"}' }],
    ["meta", { property: "og:site_name", content: "Shotscreen Browser" }],
    ["meta", { property: "og:image", content: `${site}og.png` }],
    ["meta", { property: "og:image:width", content: "1280" }],
    ["meta", { property: "og:image:height", content: "640" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["script", { type: "application/ld+json" }, JSON.stringify(jsonLd)],
  ],

  transformPageData(pageData) {
    const fm = pageData.frontmatter;
    const url = site + pageData.relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, ".html");
    const title =
      fm.layout === "home" ? `Shotscreen Browser | ${fm.titleTemplate}` : fm.titleTemplate === false ? fm.title : `${pageData.title} | Shotscreen Browser`;
    fm.head ??= [];
    fm.head.push(["meta", { property: "og:type", content: fm.date ? "article" : "website" }]);
    if (fm.date) fm.head.push(["script", { type: "application/ld+json" }, JSON.stringify(postJsonLd(fm, url))]);
    else if (fm.faq?.length) fm.head.push(["script", { type: "application/ld+json" }, JSON.stringify({ "@context": "https://schema.org", ...faqJsonLd(fm.faq) })]);
    fm.head.push(
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
      { text: "Online tool", link: "/website-screenshot/" },
      { text: "Blog", link: "/blog/" },
    ],

    sidebar: {
      "/blog/": [
        {
          text: "Mac screenshot guides",
          items: [
            { text: "All posts", link: "/blog/" },
            { text: "Mac screenshot shortcuts", link: "/blog/mac-screenshot-shortcuts" },
            { text: "Where screenshots go", link: "/blog/where-do-screenshots-go-on-mac" },
            { text: "Crop a screenshot", link: "/blog/how-to-crop-a-screenshot-on-mac" },
            { text: "Full page screenshot on Mac", link: "/blog/full-page-screenshot-mac" },
            { text: "Full page screenshot in Chrome", link: "/blog/full-page-screenshot-chrome" },
            { text: "Higher resolution screenshots", link: "/blog/higher-resolution-screenshot-mac" },
            { text: "Print screen on a Mac", link: "/blog/print-screen-on-mac" },
            { text: "Can a website detect screenshots?", link: "/blog/can-a-website-detect-screenshots" },
            { text: "Snipping Tool for Mac", link: "/blog/snipping-tool-mac" },
            { text: "Copy and paste a screenshot", link: "/blog/copy-paste-screenshot-mac" },
            { text: "Screenshot not working", link: "/blog/screenshot-not-working-mac" },
            { text: "Delete screenshots", link: "/blog/delete-screenshots-mac" },
            { text: "Mobile version of a website", link: "/blog/view-mobile-version-of-website" },
            { text: "Screenshot on a MacBook", link: "/blog/how-to-screenshot-on-macbook" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/halitsever/shotscreen" }],
  },
});
