---
title: "How to Take a Full Page Screenshot on Mac"
titleTemplate: false
description: "Take a full page screenshot on Mac in Safari, Chrome or Firefox with no extension, or in one step with a frameless browser, and what goes wrong on long pages."
headline: "Full page screenshots on a Mac in Safari, Chrome and Firefox"
date: "2026-11-28"
keyword: "how to take a full page screenshot on mac"
faq: [{"q": "Can a Mac take a scrolling screenshot?", "a": "Not with the built-in Screenshot app. Use Safari's Web Inspector, Chrome DevTools, Firefox's Take Screenshot or an app such as Shotscreen Browser."}, {"q": "Where does Chrome save a full size screenshot?", "a": "In your Downloads folder, as a PNG named after the page."}]
---

# Full page screenshots on a Mac in Safari, Chrome and Firefox

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">The Mac screenshot shortcuts capture what is on screen, so a long web page needs another tool. Every major browser on the Mac can capture a full page without an extension. Here is how in Safari, Chrome and Firefox, and in a browser built for screenshots.</p>

## The built-in tool captures the screen only

The Screenshot app (<kbd>Shift</kbd> <kbd>Command</kbd> <kbd>5</kbd>) offers the entire screen, a window or a portion of the screen. Apple's [macOS User Guide](https://support.apple.com/guide/mac-help/take-screenshots-or-screen-recordings-mh26782/mac) for macOS 27 Golden Gate lists no scrolling capture, so for anything taller than the window you need the browser or another app.

## Safari

Safari's Web Inspector can capture a whole page as an image.

1. Turn on the developer tools once: **Safari › Settings › Advanced**, then tick **Show features for web developers** (called **Show Develop menu in menu bar** in older versions).
2. Open the page and press <kbd>Option</kbd> <kbd>Command</kbd> <kbd>I</kbd> to open Web Inspector.
3. In the **Elements** tab, right-click the `<html>` line at the top of the tree.
4. Choose **Capture Screenshot**. Safari saves a PNG of the whole element, which is the whole page.

For a document rather than an image, **File › Export as PDF** saves the page as one long PDF page.

## Chrome

1. Press <kbd>Option</kbd> <kbd>Command</kbd> <kbd>I</kbd> to open DevTools.
2. Press <kbd>Shift</kbd> <kbd>Command</kbd> <kbd>P</kbd> to open the Command Menu.
3. Type `screenshot` and choose **Capture full size screenshot**.

The PNG goes to your Downloads folder. The [Chrome guide](/blog/full-page-screenshot-chrome) has more detail, including how to capture at a phone's size.

## Firefox

Right-click an empty part of the page, choose **Take Screenshot**, then **Save full page**. You can download the image or copy it.

## Things that go wrong on long pages

- **Lazy-loaded images** only load when you scroll to them. Scroll to the bottom and back before capturing, or the lower half may be blank.
- **Sticky headers and chat buttons** are fixed to the window. Depending on the tool they appear once at the top, or not at all.
- **Cookie banners** sit on top of the page and end up in the image.
- **Animations** can be caught halfway through.

## In one step: Shotscreen Browser

[Shotscreen Browser](/) is a free, frameless Mac browser for website screenshots. Choose **Full Page** in the dock and press <kbd>Command</kbd> <kbd>Shift</kbd> <kbd>S</kbd>. It measures the page's full scroll height, makes the view that tall, captures it, and puts the view back. Before the capture it also:

- hides cookie and consent banners (**Hide Cookies**, on by default),
- shortens CSS animations and transitions so nothing is caught mid-motion,
- can force the page into dark mode and wait 3, 5 or 10 seconds first.

Set the width with a viewport preset, from iPhone 15 (393 px) to Ultrawide (1920 px), so the page lays out the way it would on that device. Because the view is stretched to the page's height, sections sized to the window height (CSS `vh` units) grow with it, so check pages with full-screen hero sections. The release build runs on Apple Silicon Macs; the [download page](/download) has the steps.

## FAQ

### Can a Mac take a scrolling screenshot?

Not with the built-in Screenshot app. Use Safari's Web Inspector, Chrome DevTools, Firefox's Take Screenshot or an app such as Shotscreen Browser.

### Where does Chrome save a full size screenshot?

In your Downloads folder, as a PNG named after the page.

## Related posts

- [Mac screenshot shortcuts: every key combo](/blog/mac-screenshot-shortcuts)
- [Full page screenshot in Chrome without an extension](/blog/full-page-screenshot-chrome)
- [How to get a higher resolution screenshot on Mac](/blog/higher-resolution-screenshot-mac)
- [All posts](/blog/)
