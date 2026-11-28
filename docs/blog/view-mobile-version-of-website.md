---
title: "View the Mobile Version of a Website on a Desktop"
titleTemplate: false
description: "View the mobile version of a website on a computer with Chrome, Safari or Firefox developer tools or Shotscreen's iPhone presets, and what each misses."
headline: "See how a website looks on a phone, from your Mac"
date: "2026-11-28"
keyword: "view mobile version of website"
faq: [{"q": "How do I see the mobile version of a website on my computer?", "a": "Open the browser's developer tools and turn on the device or responsive mode: Toggle device toolbar in Chrome, Develop › Enter Responsive Design Mode in Safari, or Command-Option-M in Firefox. Then pick a phone size."}, {"q": "Why does the site still show the desktop version?", "a": "Some sites choose the mobile page on the server from the user agent. Change the user agent in the developer tools, or check on a real phone."}, {"q": "Can I take a screenshot of the mobile view?", "a": "Yes. Chrome's device toolbar has Capture screenshot in its More options menu, Firefox has a camera button, and Shotscreen saves a PNG at the chosen phone size."}]
---

# See how a website looks on a phone, from your Mac

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Most sites decide their mobile layout from the width of the window. Make the browser window as narrow as a phone screen and you see the mobile version, without picking up a phone. Every major desktop browser has a mode for this, and each can take a screenshot of the result.</p>

## Chrome: Device Mode

1. Open the page and press <kbd>Command</kbd> <kbd>Option</kbd> <kbd>I</kbd> to open DevTools.
2. Click **Toggle device toolbar**, the phone and tablet icon at the top of DevTools.
3. Choose a device from the **Dimensions** menu, or type a width and height.

To save what you see, open the **More options** menu (three dots) in the device toolbar and choose **Capture screenshot**, or **Capture full size screenshot** for the whole page. Google calls Device Mode "a first-order approximation": the page is laid out at a phone's size, but your code still runs on the desktop's processor. See [Chrome's Device Mode docs](https://developer.chrome.com/docs/devtools/device-mode) and the [Chrome full page screenshot guide](/blog/full-page-screenshot-chrome).

## Safari: Responsive Design Mode

1. In **Safari › Settings › Advanced**, turn on **Show features for web developers**. A **Develop** menu appears.
2. Choose **Develop › Enter Responsive Design Mode**.
3. Pick an iPhone or iPad size from the list at the top.

## Firefox: Responsive Design Mode

Press <kbd>Command</kbd> <kbd>Option</kbd> <kbd>M</kbd> on a Mac (<kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>M</kbd> on Windows), or choose **Tools › Browser Tools › Responsive Design Mode**. The camera button in its toolbar saves a screenshot to your downloads folder, according to [Firefox's documentation](https://firefox-source-docs.mozilla.org/devtools-user/responsive_design_mode/).

## What these modes do not show

The layout follows the window size, so CSS media queries and responsive images behave as on a phone. A few things still differ from a real device:

- **Server-side detection.** Some sites decide on the server, from the browser's user agent string, whether to send a mobile page. The developer tools can change the user agent; a narrow window on its own cannot.
- **Touch and performance.** Tap targets, scrolling feel and loading speed on a phone's processor and network are only approximated.
- **Browser chrome.** A real phone browser has its own address bar and toolbars that take part of the screen.

For a final check, open the site on an actual phone.

## Shotscreen's phone and tablet presets

[Shotscreen Browser](/) is a free Mac app that shows a page at a fixed viewport size, chosen from a menu: **iPhone 15** (393 x 852), **iPhone 15 Pro Max** (430 x 932), **iPad** (820 x 1180), **iPad Pro 13** (1024 x 1366), **MacBook Air** (1280 x 800), **Desktop** (1440 x 900), **Ultrawide** (1920 x 1080) or a custom size. The window is frameless, so the screenshot holds only the page.

Like a narrow browser window, it changes the viewport size, not the user agent, so it shows what a site's responsive CSS does at that width. Press <kbd>Command</kbd> <kbd>Shift</kbd> <kbd>S</kbd> to save a PNG of the visible area or, in Full Page mode, of the whole scroll height. On a Retina display the image has the display's pixel density, which is why the dock shows **PNG @2×**.

## FAQ

### How do I see the mobile version of a website on my computer?

Open the browser's developer tools and turn on the device or responsive mode: Toggle device toolbar in Chrome, Develop › Enter Responsive Design Mode in Safari, or Command-Option-M in Firefox. Then pick a phone size.

### Why does the site still show the desktop version?

Some sites choose the mobile page on the server from the user agent. Change the user agent in the developer tools, or check on a real phone.

### Can I take a screenshot of the mobile view?

Yes. Chrome's device toolbar has Capture screenshot in its More options menu, Firefox has a camera button, and Shotscreen saves a PNG at the chosen phone size.

## Related posts

- [How to take a full page screenshot on Mac](/blog/full-page-screenshot-mac)
- [Full page screenshot in Chrome without an extension](/blog/full-page-screenshot-chrome)
- [How to get a higher resolution screenshot on Mac](/blog/higher-resolution-screenshot-mac)
- [All posts](/blog/)
