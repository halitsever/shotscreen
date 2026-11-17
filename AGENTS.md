# Shotscreen Browser

Electron and Vue desktop app: a frameless browser for clean website screenshots, used by people who need tidy captures of web pages. Releases ship for macOS on Apple Silicon only.

## Verify a change

- CI (`.github/workflows/ci.yml`) runs on Ubuntu for pushes and pull requests to `main`: `npm ci`, `npm run lint` (a placeholder), `npm run package`, `npm run docs:build`.
- `npm run start` runs the app in dev mode through Electron Forge and Vite.
- For docs-only changes, `npm run docs:build` is enough. Set `ELECTRON_SKIP_BINARY_DOWNLOAD=1` when installing just to build the docs.

## Gotchas

- `package-lock.json` is out of sync with `package.json` on `main` (react, loose-envify and js-tokens are missing), so `npm ci` fails and CI with it. Fixing it needs a lockfile refresh, which the owner should approve. Until then, install with `npm install` and do not commit the lockfile it rewrites.
- `docs/.vitepress/dist/` and `docs/.vitepress/cache/` are not in `.gitignore`. Delete them after a local build instead of committing them.
- The window content is an Electron `<webview>` in `src/views/Main.vue`; capture goes through `src/preload.js` IPC to `src/main.js`. Changes to capture touch all three.
- `updateElectronApp()` in `src/main.js` updates installed apps from GitHub releases, so a published release reaches users directly.
- `npm run publish` uses the Electron Forge GitHub publisher, which creates a draft release. The version comes from `package.json`.
- Fuses in `forge.config.js` disable `RunAsNode` and require the app to load from asar. Keep that in mind when adding native modules.

## Docs and site

- VitePress site in `docs/`, base `/shotscreen/`, deployed to https://halitsever.github.io/shotscreen/ by `.github/workflows/docs.yaml` (uses `npm install`) on every push to `main`.
- `cleanUrls` is off, so pages are served as `.html`. Canonical URLs, Open Graph tags and JSON-LD are set in `docs/.vitepress/config.mts`.
- `docs/public/llms.txt` lists the docs pages; update it when a page is added or renamed.

## Conventions

- Conventional-commit subject lines only, in English, with no body and no trailer.
- Work on a branch and open a pull request. The owner merges.
- No emoji in new text. Code comments are short, one line where possible, and explain why.
- The README follows the owner's template. Every image served from `halitsever-api.vercel.app` stays byte-for-byte; only the `title=` value of `api/repo-title` and the issue wrapper link may be corrected.
- Version bumps and publishing releases are done by the owner.
