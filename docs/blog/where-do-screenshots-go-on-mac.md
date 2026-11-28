---
title: "Where Do Screenshots Go on Mac? Find and Change It"
titleTemplate: false
description: "Where do screenshots go on Mac? To the desktop by default. How to find old ones, change the save location, and why one is sometimes missing."
headline: "Where do screenshots go on Mac?"
date: "2026-11-28"
keyword: "where do screenshots go on mac"
faq: [{"q": "Where are screenshots saved on a Mac?", "a": "On the desktop, as PNG files named Screenshot followed by the date and time, unless you chose another place under Options in the Screenshot app."}, {"q": "Why can't I find my screenshot on the desktop?", "a": "It may still be waiting behind the floating thumbnail, it may have gone to the clipboard because you held Control, or Save to may point to another folder."}, {"q": "How do I make screenshots save to a folder?", "a": "Press Shift-Command-5, click Options, and choose Other Location under Save to. Pick or create the folder you want."}]
---

# Where do screenshots go on Mac?

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">By default, a Mac saves every screenshot to the desktop as a PNG file whose name starts with "Screenshot" and includes the date and time. You can send them somewhere else in a few clicks, and find old ones with one search.</p>

## The default location: the desktop

Screenshots taken with the keyboard shortcuts are saved to the desktop, the default screenshots folder. In Finder that is the **Desktop** folder in your home folder, `~/Desktop`. Screenshots taken from the Screenshot app (<kbd>Shift</kbd> <kbd>Command</kbd> <kbd>5</kbd>) go to the location chosen in its **Options** menu, which is also the desktop until you change it.

The macOS steps here were checked against Apple's [macOS User Guide](https://support.apple.com/guide/mac-help/take-screenshots-or-screen-recordings-mh26782/mac) for macOS 27 Golden Gate and [Apple's screenshot guide](https://support.apple.com/en-us/102646) in November 2026. They have worked the same way since macOS Mojave unless noted.

## Change where screenshots are saved

1. Press <kbd>Shift</kbd> <kbd>Command</kbd> <kbd>5</kbd> to open the Screenshot app.
2. Click **Options**.
3. Under **Save to**, pick a new save location: one of the preset places, such as Documents, Clipboard, Mail, Messages or Preview, or choose **Other Location** and select any folder.

The choice sticks for later screenshots, including those taken with <kbd>Shift</kbd> <kbd>Command</kbd> <kbd>3</kbd> and <kbd>4</kbd>. A common setup is a **Screenshots** folder inside **Pictures**, so the desktop stays clear.

### From Terminal

The same setting can be changed with one command, which is handy when setting up a new Mac from a script:

```bash
mkdir -p ~/Pictures/Screenshots
defaults write com.apple.screencapture location ~/Pictures/Screenshots
killall SystemUIServer
```

The last line restarts the process that handles screenshots so the change applies at once. To return to the desktop, run `defaults delete com.apple.screencapture location` and the `killall` line again.

## How to find screenshots on a Mac

- **Search by name.** In Finder or Spotlight, search for `Screenshot`. Every screenshot's name starts with that word, or with `Screen Shot` for those taken before macOS Ventura.
- **Search by type.** Spotlight marks screen captures. In Spotlight or a Finder search, `kMDItemIsScreenCapture:1` lists them all, wherever they are.
- **Recents.** Finder's **Recents** shows recently created files, newest first.

## Why a screenshot is not where you expect

- **The floating thumbnail is still showing.** The file is written when the thumbnail in the corner goes away. Wait a few seconds, or click it.
- **You held Control.** With <kbd>Control</kbd> the image goes to the clipboard and no file is made.
- **Save to was changed.** Check the location in the Screenshot app's **Options** menu.
- **Your desktop syncs with iCloud.** With **Desktop & Documents Folders** turned on in iCloud Drive, the desktop lives in iCloud Drive. Screenshots are still there, and also on your other devices.

## Where Shotscreen saves website screenshots

[Shotscreen Browser](/) does not use the macOS screenshot folder. Each capture opens a save dialog that suggests your **Pictures** folder and a name such as `shotscreen-2026-05-28T01-52-57-000Z.png`. You can pick any folder. The **clock icon** in the top-right corner lists the shots taken since the app was opened, with the site name, size and time, and a button that copies a file's path. The list starts empty each time the app opens, so the files themselves are the record. The [download page](/download) covers installing it.

## FAQ

### Where are screenshots saved on a Mac?

On the desktop, as PNG files named Screenshot followed by the date and time, unless you chose another place under Options in the Screenshot app.

### Why can't I find my screenshot on the desktop?

It may still be waiting behind the floating thumbnail, it may have gone to the clipboard because you held Control, or Save to may point to another folder.

### How do I make screenshots save to a folder?

Press Shift-Command-5, click Options, and choose Other Location under Save to. Pick or create the folder you want.

## Related posts

- [Mac screenshot shortcuts: every key combo](/blog/mac-screenshot-shortcuts)
- [When screenshots stop working on a Mac](/blog/screenshot-not-working-mac)
- [Delete screenshots on a Mac and keep the desktop clear](/blog/delete-screenshots-mac)
- [All posts](/blog/)
