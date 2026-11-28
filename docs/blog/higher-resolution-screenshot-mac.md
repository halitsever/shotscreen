---
title: "How to Get a Higher Resolution Screenshot on Mac"
titleTemplate: false
description: "Why Mac screenshots look blurry, how Retina scaling sets their pixel size, and how to get a sharper, higher resolution screenshot of the screen or a web page."
headline: "How to get a higher resolution screenshot on Mac"
date: "2026-11-28"
keyword: "macos screenshot how can i get a higher resolution screenshot"
faq: [{"q": "Are Mac screenshots full resolution?", "a": "Yes. A screenshot saves every pixel the display shows, as a PNG. On a Retina display that is usually twice the point size in each direction."}, {"q": "Why is my screenshot smaller on an external monitor?", "a": "Standard monitors map one point to one pixel, so a window captured there has half the width and height in pixels of the same window on a Retina screen."}]
---

# How to get a higher resolution screenshot on Mac

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">A Mac screenshot already has every pixel the display shows. If it looks soft, the cause is usually the display it was taken on, a later resize, or compression when it was shared. Here is how the pixel size is decided and how to get more of them.</p>

## How big is a Mac screenshot?

macOS draws everything in points and maps each point to one or more pixels. On a Retina display a point is usually 2 x 2 pixels. A screenshot saves the pixels, not the points.

| Display | Looks like | Full-screen screenshot |
| --- | --- | --- |
| Retina, default scaling | 1440 x 900 | 2880 x 1800 pixels |
| Same display, "More Space" | 1680 x 1050 | 3360 x 2100 pixels |
| Standard external monitor | 1920 x 1080 | 1920 x 1080 pixels |

The numbers in the first two rows are examples; your Mac's scaling options are in **System Settings › Displays**. The point is the ratio: the same window captured on a Retina screen has twice the width and height in pixels of one captured on a standard monitor. Screenshots are PNG files, which lose nothing in compression.

The macOS steps here were checked against Apple's [macOS User Guide](https://support.apple.com/guide/mac-help/take-screenshots-or-screen-recordings-mh26782/mac) for macOS 27 Golden Gate and [Apple's screenshot guide](https://support.apple.com/en-us/102646) in November 2026. They have worked the same way since macOS Mojave unless noted.

## Why a screenshot looks blurry

- **It was taken on a non-Retina monitor.** Each point became one pixel. Drag the window to the Mac's built-in Retina display and take it again.
- **It was resized.** Pasting a 2880-pixel image into a slot 720 pixels wide shrinks it, and enlarging it later cannot bring the detail back.
- **It was compressed.** Chat apps and some websites turn screenshots into JPEGs or shrink them on upload. Send it as a file, or zip it.
- **It was saved as JPEG.** If someone changed the format with `defaults write com.apple.screencapture type jpg`, run `defaults write com.apple.screencapture type png` and `killall SystemUIServer` to go back.

## Ways to get a higher resolution screenshot

1. **Use a Retina display.** The built-in screen of a MacBook or an iMac captures at 2x.
2. **Zoom in before you capture.** In a browser, <kbd>Command</kbd> <kbd>+</kbd> makes text and images larger on screen, so each letter uses more pixels. Capture a smaller area at a larger zoom instead of a large area at 100%.
3. **Make the content bigger, not the image.** For a diagram or a document, export it from its own app (as PDF or SVG) rather than screenshotting it.
4. **For web pages, set the pixel ratio.** In Chrome's device toolbar you can set a device pixel ratio of 3 and use **Capture full size screenshot**. The page renders at three times its CSS size. The steps are in the [Chrome guide](/blog/full-page-screenshot-chrome).

## Exact sizes for website screenshots

For screenshots of websites, the size that matters is usually the viewport, the width the page lays out for. [Shotscreen Browser](/) sets it exactly with presets from iPhone 15 (393 x 852) to Ultrawide (1920 x 1080), or any custom size. It captures with Electron's page capture, so on a Retina display the image has the display's pixel density, which is why the dock shows **PNG @2×**. Since the viewport is exact, you do not have to [crop](/blog/how-to-crop-a-screenshot-on-mac) or resize the result.

## FAQ

### Are Mac screenshots full resolution?

Yes. A screenshot saves every pixel the display shows, as a PNG. On a Retina display that is usually twice the point size in each direction.

### Why is my screenshot smaller on an external monitor?

Standard monitors map one point to one pixel, so a window captured there has half the width and height in pixels of the same window on a Retina screen.

## Related posts

- [Where do screenshots go on Mac?](/blog/where-do-screenshots-go-on-mac)
- [How to crop a screenshot on Mac](/blog/how-to-crop-a-screenshot-on-mac)
- [Full page screenshot in Chrome without an extension](/blog/full-page-screenshot-chrome)
- [All posts](/blog/)
