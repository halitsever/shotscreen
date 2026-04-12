---
layout: home

hero:
  image:
    src: /logo.png
  name: "Shotscreen Browser"
  text: "Frameless Browser for macOS"
  tagline: Take clean, beautiful screenshots of any website — no distractions, no chrome.
  actions:
    - theme: brand
      text: Download
      link: /download
    - theme: alt
      text: Source Code
      link: https://github.com/halitsever/shotscreen-browser

features:
  - title: Frameless Window
    details: The browser window has no toolbar or address bar — your screenshot contains only the website, nothing else.
  - title: Overlay Panel
    details: A floating, draggable control panel lets you navigate, resize the window, and capture screenshots without cluttering the view.
  - title: Rounded Corners
    details: Saved screenshots automatically get rounded corners, giving them a polished, modern look.
---

## Getting Started

After launching Shotscreen Browser you will see a blank, frameless window with the overlay panel open in the center.

### Opening & Closing the Overlay

The overlay is your control center. Toggle it at any time with the keyboard shortcut:

| Platform | Shortcut |
| -------- | -------- |
| macOS    | `⌘ Shift O` |
| Windows / Linux | `Ctrl Shift O` |

### Navigating to a Website

1. Open the overlay.
2. Type or paste a URL into the **Website** field (e.g. `example.com` — the `https://` prefix is added automatically).
3. Press `Enter` or click **Visit**.

The webview loads the page immediately. The URL field stays in sync as you navigate within the page.

### Resizing the Window

Use the **Resize** section to set an exact pixel size for the window before taking a screenshot — useful when you need a specific viewport (e.g. `1200 × 800` for a desktop mockup).

1. Enter the desired **Width** and **Height**.
2. Click **Apply Resize**.

### Taking a Screenshot

1. Navigate to the page you want to capture.
2. Open the overlay and click **Take Screenshot**.  
   The overlay disappears while the capture runs so it is not included in the image.
3. A save dialog opens — choose a location and confirm.

The exported PNG has **rounded corners** (12 px radius) applied automatically.

::: tip
For the cleanest result, resize the window to your target dimensions before capturing.
:::

### Keyboard Shortcut Reference

| Action | Shortcut |
| ------ | -------- |
| Toggle overlay | `⌘ Shift O` / `Ctrl Shift O` |
| Visit URL (when overlay is open) | `Enter` in the URL field |
