---
title: "Can a Website Detect Screenshots? What It Can See"
titleTemplate: false
description: "A website cannot see a screenshot you take with your operating system. What a page can notice (keys, focus, DevTools, page changes) and what it cannot."
headline: "Can a website detect screenshots?"
date: "2026-11-28"
keyword: "can a website detect screenshots"
faq: [{"q": "Can a website tell if I screenshot it on my phone?", "a": "Not from the browser. Native apps can on some systems, iOS tells apps about screenshots, but a website in Safari or Chrome cannot."}, {"q": "Can Chrome extensions be detected when taking screenshots?", "a": "Sometimes. Extensions that scroll, resize or modify the page while capturing make changes the page can observe. A change in size or content is all the page sees, not the screenshot."}]
---

# Can a website detect screenshots?

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">No. A web page has no way to find out that you took a screenshot with your operating system's tools. It runs inside the browser's sandbox and never sees the image. It can notice a few things around a screenshot, though, and apps on your phone can do more than websites can.</p>

## Why a page cannot see an OS screenshot

The Mac's screenshot shortcuts and the Screenshot app run in macOS, outside the browser. They read what is on the screen and write a file. No web API reports that event, and the browser does not tell the page. The same holds for the Snipping Tool on Windows and screenshot buttons on Android and iOS when you are in a browser.

## What a page can notice

- **Key presses sent to the page.** JavaScript can listen to keyboard events while the page has focus. System shortcuts such as <kbd>Shift</kbd> <kbd>Command</kbd> <kbd>3</kbd> are handled by macOS, so at most the page sees modifier keys being pressed. Some sites listen for the Print Screen key on Windows. That tells them a key was pressed, not that an image was saved, and it misses every other way of taking a screenshot.
- **Losing focus.** When another window takes focus, the page gets a `blur` event, and a `visibilitychange` event when it is hidden. Many things cause these, so they prove nothing.
- **Browser screenshot tools that change the page.** Some extensions scroll the page, resize it or add elements to it while they work. A page watching its own layout or DOM can see those changes.
- **DevTools.** Pages can guess that developer tools are open, for example from the window size, but not what you do with them. Chrome's **Capture full size screenshot** briefly resizes the page's viewport to its full height, which the page can see as a resize event, but nothing tells it why.

## Protected video is a different case

Netflix and similar services play video through DRM. When you capture the screen, the video area often comes out black. That is not the website detecting anything: the operating system and browser keep protected video out of captures.

## Apps can detect screenshots, websites cannot

Native apps run with more access than web pages. iOS tells apps when the user takes a screenshot, which is how some messaging apps notify the other person. Android apps can block screenshots of their own windows. None of this is available to a website in a mobile browser.

## What Shotscreen does to a page

[Shotscreen Browser](/) captures pages through Electron, the same engine as Chrome. Before a capture it changes the page in a few visible ways, all from its own code:

- adds a style element that shortens animations and transitions,
- hides elements whose class, id or label mentions cookie, consent or GDPR (when **Hide Cookies** is on),
- adds a style element with an inverting filter for **Dark Mode**, if you turned it on,
- in **Full Page** mode, reads the page's scroll height and makes the view that tall for the capture.

It does not send anything about the capture to the site. A page that watched its own DOM with a `MutationObserver` could notice the added styles or the resize, and the browser's user agent string mentions Electron. The capture itself happens outside the page. The [guide](/#capture-options) lists every option.

## FAQ

### Can a website tell if I screenshot it on my phone?

Not from the browser. Native apps can on some systems, iOS tells apps about screenshots, but a website in Safari or Chrome cannot.

### Can Chrome extensions be detected when taking screenshots?

Sometimes. Extensions that scroll, resize or modify the page while capturing make changes the page can observe. A change in size or content is all the page sees, not the screenshot.

## Related posts

- [Mac screenshot shortcuts: every key combo](/blog/mac-screenshot-shortcuts)
- [How to take a full page screenshot on Mac](/blog/full-page-screenshot-mac)
- [Full page screenshot in Chrome without an extension](/blog/full-page-screenshot-chrome)
- [All posts](/blog/)
