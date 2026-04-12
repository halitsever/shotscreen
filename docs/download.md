<script setup>
import { VPButton } from 'vitepress/theme'


</script>

# Download

::: warning
This page and github only source for downloading shotscreen
:::

<VPButton text="Download from GH Releases" href="https://github.com/halitsever/shotscreen-browser/releases" />

## macOS — First Launch

Because Shotscreen Browser is not distributed through the Mac App Store, macOS Gatekeeper will block it on the first run with a *"can't be opened because it is from an unidentified developer"* message.

Run this command **once** in Terminal after moving the app to your Applications folder:

```bash
xattr -cr "/Applications/Shotscreen Browser.app"
```

Then open the app normally. You will not need to repeat this step.
