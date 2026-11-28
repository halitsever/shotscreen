---
title: "Mac Screenshot Not Working? What to Check"
titleTemplate: false
description: "Mac screenshot shortcuts doing nothing, or screenshots that never show up? Check the shortcut settings, save location, thumbnail, blocked apps and permissions."
headline: "When screenshots stop working on a Mac"
date: "2026-11-28"
keyword: "mac screenshot not working"
faq: [{"q": "Why is Shift-Command-4 not working on my Mac?", "a": "The shortcut may be turned off or changed. Check System Settings › Keyboard › Keyboard Shortcuts › Screenshots, and make sure no other app uses the same keys."}, {"q": "Why can't I find the screenshot I just took?", "a": "It may have gone to another folder or the clipboard, set under Options › Save to in the Screenshot app, or it may still be waiting behind the floating thumbnail."}, {"q": "Why is my screenshot black?", "a": "Some apps, such as the Apple TV app, do not let their windows be captured, so what they show is left out of the screenshot or appears black."}]
---

# When screenshots stop working on a Mac

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">When a Mac screenshot fails, either the shortcut does nothing at all, or it works and the file does not appear where you expect. The checks below go from the most common cause to the least, and each one takes a minute or less.</p>

## 1. Try the Screenshot app

Press <kbd>Shift</kbd> <kbd>Command</kbd> <kbd>5</kbd>, or open **Screenshot** from Spotlight or the Utilities folder in Applications. If the toolbar opens and a capture works from there, macOS is fine and the problem is the keyboard shortcut. If the app also fails, skip to the later checks.

The macOS steps here were checked against Apple's [macOS User Guide](https://support.apple.com/guide/mac-help/take-screenshots-or-screen-recordings-mh26782/mac) for macOS 27 Golden Gate and [Apple's screenshot guide](https://support.apple.com/en-us/102646) in November 2026. They have worked the same way since macOS Mojave unless noted.

## 2. Check that the shortcuts are on

The shortcuts can be turned off or changed in System Settings, sometimes by another app that took them over.

1. Open **Apple menu › System Settings › Keyboard**.
2. Click **Keyboard Shortcuts** and choose **Screenshots** in the sidebar.
3. Make sure each shortcut is ticked. Double-click one to see or set its keys.

If you recently installed a screenshot or window-manager app, check its own settings too. Two apps cannot use the same key combination.

## 3. Look in the right place

Often the screenshot worked and was saved somewhere else:

- **Save to points elsewhere.** The Screenshot app's **Options › Save to** decides where the shortcuts save. It may be set to a folder, to Clipboard, or to an app such as Preview.
- **You held Control.** That copies the image to the clipboard instead of saving a file. See [copy and paste a screenshot](/blog/copy-paste-screenshot-mac).
- **The thumbnail is still showing.** The file is written once the floating thumbnail in the corner disappears. Swipe it to the right to save at once.

The full rundown is in [where screenshots go on Mac](/blog/where-do-screenshots-go-on-mac).

## 4. The app does not allow it

Apple notes that some apps, such as the Apple TV app and DVD Player, may not let you capture their windows. What such an app shows is left out of the capture or appears black. This is the app's choice, not a fault on your Mac.

## 5. A third-party app cannot capture

Apps other than Apple's need permission to see the screen. Open **Apple menu › System Settings › Privacy & Security**, scroll down, click **Screen & System Audio Recording** and turn the app on. The built-in shortcuts do not need this permission, so if only the third-party app fails, this is the place to look.

## 6. Restart

If nothing above helps, restart the Mac. That resets the system processes that handle screenshots and keyboard shortcuts, and it is quicker than further digging.

## Website screenshots

If what you are trying to capture is a web page, [Shotscreen Browser](/) avoids most of these steps: it captures the page from its own frameless window with <kbd>Command</kbd> <kbd>Shift</kbd> <kbd>S</kbd> and always opens a save dialog, so you choose where the PNG goes every time.

## FAQ

### Why is Shift-Command-4 not working on my Mac?

The shortcut may be turned off or changed. Check System Settings › Keyboard › Keyboard Shortcuts › Screenshots, and make sure no other app uses the same keys.

### Why can't I find the screenshot I just took?

It may have gone to another folder or the clipboard, set under Options › Save to in the Screenshot app, or it may still be waiting behind the floating thumbnail.

### Why is my screenshot black?

Some apps, such as the Apple TV app, do not let their windows be captured, so what they show is left out of the screenshot or appears black.

## Related posts

- [Mac screenshot shortcuts: every key combo](/blog/mac-screenshot-shortcuts)
- [Where do screenshots go on Mac?](/blog/where-do-screenshots-go-on-mac)
- [Copy a screenshot on Mac and paste it anywhere](/blog/copy-paste-screenshot-mac)
- [All posts](/blog/)
