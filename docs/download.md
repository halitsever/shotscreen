---
title: "Download"
description: Download Shotscreen Browser for macOS from GitHub Releases and open it for the first time.
---

<script setup>
import { VPButton } from 'vitepress/theme'


</script>

# Get Shotscreen Browser for your Mac

::: warning
This page and the GitHub Releases page of the repository are the only official sources for Shotscreen Browser. Builds from other sites are not made by this project.
:::

Shotscreen Browser is a free desktop app for taking clean screenshots of websites on a Mac. It is open source under the MIT license, and each version is published as a GitHub release with its own download.

<VPButton text="Download from GH Releases" href="https://github.com/halitsever/shotscreen/releases" />

## Requirements

Release builds are made for macOS on Apple Silicon (M-series) Macs. There are no release builds for Intel Macs, Windows or Linux. On those systems you can still run the app from source, as described below.

## Install

1. Open the [latest release](https://github.com/halitsever/shotscreen/releases/latest) on GitHub.
2. Under **Assets**, download the file named like `Shotscreen.Browser-darwin-arm64-<version>.zip`.
3. Open the zip file. macOS unpacks it to `Shotscreen Browser.app`.
4. Drag `Shotscreen Browser.app` into your Applications folder.

## macOS - First Launch

Because Shotscreen Browser is not distributed through the Mac App Store, macOS Gatekeeper will block it on the first run with a _"can't be opened because it is from an unidentified developer"_ message.

Run this command **once** in Terminal after moving the app to your Applications folder:

```bash
xattr -cr "/Applications/Shotscreen Browser.app"
```

`xattr -cr` clears the extended attributes on the app bundle, including the quarantine flag that macOS adds to files downloaded from the internet. Gatekeeper uses that flag to decide whether to block an app, so once it is gone the app opens like any other.

Then open the app normally. You will not need to repeat this step.

## After the first launch

On the first start the app shows a short welcome screen. Click **Get Started** to reach the browser window. The app remembers that you have seen it and goes straight to the browser from then on.

Type a URL in the address bar, choose a viewport size in the dock and press `⌘ ⇧ S` to capture. Screenshots are saved as PNG files, and the save dialog suggests your Pictures folder with a file name such as `shotscreen-2026-05-28T01-52-57-000Z.png`. The [guide on the home page](/) explains every control.

## Updates

The app checks GitHub Releases for new versions through `update-electron-app`, so new releases are offered from the same place you downloaded it. You can also download a newer zip from the releases page at any time and replace the copy in Applications.

## Run from source

If you are not on an Apple Silicon Mac, or you want to try unreleased changes, run the app from the repository with Node.js and npm:

```bash
git clone https://github.com/halitsever/shotscreen.git
cd shotscreen
npm install
npm run start
```

`npm run start` launches the app in development mode through Electron Forge and Vite. Found a problem? Open an [issue on GitHub](https://github.com/halitsever/shotscreen/issues).
