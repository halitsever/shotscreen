---
layout: home

hero:
  image:
    src: /logo.png
  name: "Shotscreen Browser"
  text: "Frameless Browser for macOS"
  tagline: Take clean, beautiful screenshots of any website - no distractions, no chrome.
  actions:
    - theme: brand
      text: Download
      link: /download
    - theme: alt
      text: Source Code
      link: https://github.com/halitsever/shotscreen

features:
  - title: Frameless Window
    details: No toolbar, no title bar - your screenshot contains only the website and nothing else.
  - title: Adjustable Corner Radius
    details: Choose from presets or dial in an exact radius (0–32 px) from the Settings panel. Default is 24 px for a polished, modern look.
  - title: Viewport Presets
    details: Instantly switch between iPhone, iPad, MacBook, Desktop, Ultrawide, or type any custom size.
  - title: Full-Page Capture
    details: Capture the entire scroll height of a page - not just the visible viewport - in one shot.
  - title: Dark Mode
    details: Force any website into dark mode before capturing without changing your system preference.
  - title: Cookie Banner Hiding
    details: Automatically hides GDPR/cookie consent overlays so they never appear in your screenshots.
---

## Interface Overview

When you launch Shotscreen Browser you'll see three main UI elements:

| Element | Location | Purpose |
|---|---|---|
| **Address bar** | Top, center | Navigate to a URL |
| **Dock** | Bottom, center | All capture controls |
| **Settings / History** | Top right | Corner radius settings & recent shots |

---

## Navigating to a Website

Click the address bar at the top of the window, type or paste a URL (the `https://` prefix is added automatically if omitted), then press `Enter`.

The host and path are displayed separately in the bar while browsing. Click the **×** button on the right to clear and reset to a blank page.

---

## The Dock

The dock sits at the bottom of the window and contains every capture control.

### Navigation

| Button | Action |
|---|---|
| ← | Go back one page |
| ↺ | Reload the current page |

### Viewport

Click the **device pill** (e.g. *MacBook Air 1280×800*) to open the viewport menu. Choose a preset or enter a custom width and height and click **Use**.

| Preset | Width × Height |
|---|---|
| iPhone 15 | 393 × 852 |
| iPhone 15 Pro Max | 430 × 932 |
| iPad | 820 × 1180 |
| iPad Pro 13″ | 1024 × 1366 |
| MacBook Air | 1280 × 800 |
| Desktop | 1440 × 900 |
| Ultrawide | 1920 × 1080 |

### Capture Mode

Two mode buttons sit in a segmented control:

| Mode | Description |
|---|---|
| **Viewport** | Captures only the visible area |
| **Full Page** | Expands the webview to the full scroll height before capturing |

### Capture Options

| Button | What it does |
|---|---|
| **Delay** | Cycles through 0 → 3 → 5 → 10 s countdown before capture |
| **Dark Mode** | Injects a CSS filter to force dark mode on the page |
| **Round Corners** | Applies the corner radius (set in Settings) to the saved image |
| **Hide Cookies** | Hides cookie / GDPR consent banners |

### Capture Button

Click **Capture** (or press `⌘ ⇧ S`) to take a screenshot. A save dialog will appear so you can choose where to save the file.

---

## Settings - Corner Radius

Click the **⚙ gear icon** in the top-right corner to open the Settings panel.

The **Corner Radius** control lets you choose how rounded the edges of your saved screenshots are:

| Preset | Radius |
|---|---|
| None | 0 px |
| Soft | 8 px |
| Round | 16 px |
| Full | 24 px *(default)* |

You can also drag the slider for any value between 0 and 32 px. The current value is shown next to the label in real time.

> Corner rounding is only applied to the saved file - it is not visible in the live preview window.

---

## Shot History

Click the **clock icon** in the top-right corner to view recent captures. Each entry shows the site name, dimensions, and a timestamp. Click the **copy** button on any row to copy its file path to the clipboard.

---

## Keyboard Shortcut

| Action | Shortcut |
|---|---|
| Capture screenshot | `⌘ ⇧ S` |
