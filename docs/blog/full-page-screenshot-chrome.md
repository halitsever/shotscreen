---
title: "Full Page Screenshot in Chrome Without an Extension"
titleTemplate: false
description: "Chrome can take a full page screenshot with no extension: DevTools has Capture full size screenshot. Steps for Mac and Windows, phone sizes and pitfalls."
headline: "Chrome's built-in full page screenshot, no extension needed"
date: "2026-11-28"
keyword: "full page screenshot chrome"
faq: [{"q": "Does Chrome have a full page screenshot?", "a": "Yes. Open DevTools, press Command-Shift-P (Ctrl-Shift-P on Windows), type screenshot and choose Capture full size screenshot."}, {"q": "Why is part of my Chrome full page screenshot blank?", "a": "The page loads some images only when you scroll to them. Scroll to the bottom and back before capturing."}]
---

# Chrome's built-in full page screenshot, no extension needed

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Chrome has a full page screenshot built in. It is just not in the main menu: it lives in DevTools, the developer panel every copy of Chrome ships with. No extension, no sign-in, and no access to your browsing given to a third party.</p>

## The steps

1. Open the page you want and let it finish loading.
2. Open DevTools: <kbd>Option</kbd> <kbd>Command</kbd> <kbd>I</kbd> on Mac, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> on Windows and Linux.
3. Open the Command Menu: <kbd>Shift</kbd> <kbd>Command</kbd> <kbd>P</kbd> on Mac, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>P</kbd> on Windows and Linux.
4. Type `screenshot`.
5. Choose **Capture full size screenshot**.

Chrome saves a PNG of the whole page to your Downloads folder. The same steps work in Microsoft Edge, Brave and other Chromium browsers.

## The other screenshot commands

The Command Menu has four:

| Command | Captures |
| --- | --- |
| Capture full size screenshot | The whole page, top to bottom |
| Capture screenshot | Only the visible part of the page |
| Capture area screenshot | An area you drag out |
| Capture node screenshot | The element selected in the Elements panel |

**Capture node screenshot** is handy for one card, chart or table: select its element in the **Elements** panel first.

## At a phone or tablet size

1. In DevTools, click the device icon or press <kbd>Shift</kbd> <kbd>Command</kbd> <kbd>M</kbd> (<kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>M</kbd> on Windows) to turn on the device toolbar.
2. Pick a device from the list, or type a width and height.
3. Open the toolbar's three-dot menu and choose **Capture full size screenshot**.

The image comes out at the device pixel ratio shown in the toolbar, so an iPhone preset with a ratio of 3 gives three times as many pixels as the CSS width. The [high-resolution guide](/blog/higher-resolution-screenshot-mac) explains why that matters.

## Pitfalls

- **Lazy-loaded images** stay empty if you never scrolled to them. Scroll to the bottom and back up first.
- **Fixed headers** may appear in the middle or be cut off, depending on how the page builds them.
- **Cookie banners** are part of the page and are captured too. Close them before capturing.
- **The DevTools panel** does not appear in the image, but it does narrow the page while docked to the side. Dock it at the bottom, or undock it, to keep the page at its normal width.

## Without DevTools: a frameless browser

If you capture websites often, opening DevTools each time gets old. [Shotscreen Browser](/) is a free Mac app built on Chromium (through Electron) that does the same capture from one button. Pick a viewport preset, choose **Full Page**, and press <kbd>Command</kbd> <kbd>Shift</kbd> <kbd>S</kbd>. It hides cookie banners and freezes animations before the capture, and can round the corners of the saved image. See [full page screenshots on Mac](/blog/full-page-screenshot-mac) for how its full-page mode works and how it compares with Safari and Firefox.

## FAQ

### Does Chrome have a full page screenshot?

Yes. Open DevTools, press Command-Shift-P (Ctrl-Shift-P on Windows), type screenshot and choose Capture full size screenshot.

### Why is part of my Chrome full page screenshot blank?

The page loads some images only when you scroll to them. Scroll to the bottom and back before capturing.

## Related posts

- [How to take a full page screenshot on Mac](/blog/full-page-screenshot-mac)
- [How to get a higher resolution screenshot on Mac](/blog/higher-resolution-screenshot-mac)
- [Can a website detect screenshots?](/blog/can-a-website-detect-screenshots)
- [All posts](/blog/)
