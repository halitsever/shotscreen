---
title: "Website Screenshot Online: Capture Any URL Free"
titleTemplate: false
description: "Take a website screenshot online: paste a URL, pick a viewport and get a PNG. A free shared endpoint, 7 requests per 10 minutes. Full-page shots in the Mac app."
outline: [2, 2]
faq:
  - q: "Is this website screenshot tool free?"
    a: "Yes. It calls the free shared shotsnap endpoint, which allows 7 requests per 10 minutes per IP address, about 1,000 a day. It has no uptime guarantee."
  - q: "Why did my screenshot fail?"
    a: "After 7 requests in 10 minutes from one IP address the endpoint answers HTTP 429 (Too Many Requests) until the window passes. A screenshot can also fail when the site is unreachable, blocks cloud browsers, or the free endpoint is down."
  - q: "Can it take a full-page screenshot?"
    a: "No. The endpoint captures the viewport you pick. For the whole scroll height, use the Full Page mode in Shotscreen Browser or the full-size capture built into Chrome DevTools."
  - q: "What does this page store?"
    a: "Only the times of your requests, in your browser's local storage, so it can stop before the limit. The URL you enter is sent to the shotsnap endpoint, which runs on Vercel."
---

<script setup>
import ScreenshotTool from "../.vitepress/components/ScreenshotTool.vue";
</script>

# Take a screenshot of any website from its URL

Paste a web address, pick a viewport size and press **Take screenshot**. A cloud browser opens the page and sends back a PNG of what it sees. There is nothing to install and no account.

<ScreenshotTool />

## How the online screenshot works

Each click sends one GET request from your browser to the shotsnap endpoint:

```txt
https://shotsnap.vercel.app/api/screenshot?page=<url>&width=<width>&height=<height>
```

The endpoint starts a browser in the cloud, loads the page at the width and height you chose, and returns the image. The PNG comes back at twice the viewport size, so a 1280 x 800 viewport gives a 2560 x 1600 image. It is the same endpoint the [shotsnap](https://projects.halit.org/shotsnap/) Node.js package calls, and its [HTTP API is documented](https://projects.halit.org/shotsnap/taking-screenshot.html) on the shotsnap site.

## Limits of the free endpoint

The endpoint is a free shared service. Everyone who uses it, from this page or from code, shares the same capacity, and it has no uptime guarantee.

| Limit | Value |
| --- | --- |
| Requests | 7 per 10 minutes per IP address, about 1,000 a day |
| Over the limit | HTTP 429 (Too Many Requests) until the 10 minutes pass |
| Capture area | The viewport you pick, not the full page |
| Page options | None: no dark mode, no cookie banner hiding, no delay |
| Cost | Free |

This page counts your requests in the browser and stops at 7 in 10 minutes, so it does not send a request that would get a 429. Other clients on the same IP address, such as a script using the npm package, count toward the same limit, so the endpoint can still refuse a request before the page's own count is reached.

## When the Mac app is the better choice

[Shotscreen Browser](/) is a free, open-source Mac app built for website screenshots. It renders the page on your own Mac, so it has no request limit, and it can do what the online tool cannot:

| | Online tool (this page) | Shotscreen Browser |
| --- | --- | --- |
| Runs on | Any browser | macOS on Apple Silicon |
| Full-page capture | No | Yes, Full Page mode |
| Viewports | 4 presets | 7 presets and any custom size |
| Force dark mode | No | Yes |
| Hide cookie banners | No | Yes |
| Rounded corners | No | 0 to 32 px, 24 px by default |
| Capture delay | No | 0, 3, 5 or 10 seconds |
| Request limit | 7 per 10 minutes per IP | None |

The window has no toolbar or title bar, so the saved image holds only the website. Press <kbd>Command</kbd> <kbd>Shift</kbd> <kbd>S</kbd> to capture. [Download Shotscreen Browser](/download) from its GitHub releases.

## Screenshots from code

If you need more than the shared limit allows, run a headless browser yourself. The shotsnap site compares the two options in [Puppeteer screenshot vs shotsnap](https://projects.halit.org/shotsnap/puppeteer-screenshot.html), with code for each.

## Other ways to capture a website

- [Full page screenshot in Chrome without an extension](/blog/full-page-screenshot-chrome) uses the capture built into DevTools.
- [Full page screenshot on Mac](/blog/full-page-screenshot-mac) covers Safari, Chrome and Firefox.
- [Mac screenshot shortcuts](/blog/mac-screenshot-shortcuts) lists every built-in key combination.

## FAQ

### Is this website screenshot tool free?

Yes. It calls the free shared shotsnap endpoint, which allows 7 requests per 10 minutes per IP address, about 1,000 a day. It has no uptime guarantee.

### Why did my screenshot fail?

After 7 requests in 10 minutes from one IP address the endpoint answers HTTP 429 (Too Many Requests) until the window passes. A screenshot can also fail when the site is unreachable, blocks cloud browsers, or the free endpoint is down.

### Can it take a full-page screenshot?

No. The endpoint captures the viewport you pick. For the whole scroll height, use the Full Page mode in Shotscreen Browser or the full-size capture built into Chrome DevTools.

### What does this page store?

Only the times of your requests, in your browser's local storage, so it can stop before the limit. The URL you enter is sent to the shotsnap endpoint, which runs on Vercel.
