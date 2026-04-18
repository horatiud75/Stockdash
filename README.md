# Stock Dashboard Pro — PWA

Multi-agent stock portfolio analysis, installable as a phone app.

## What's in this folder

- `index.html` — the app itself (main file)
- `manifest.json` — tells Android "I am an installable app"
- `sw.js` — service worker (enables offline + install prompt)
- `icon-192.png`, `icon-512.png` — app icons
- `icon-192-maskable.png`, `icon-512-maskable.png` — icons that work with Android's adaptive icon cropping
- `apple-touch-icon.png` — iOS home screen icon
- `favicon.png` — browser tab icon

**All 8 files must be uploaded together, in the same folder.**

## Deploy to GitHub Pages (5 minutes, free, HTTPS)

1. Create a free account at github.com if you don't have one.
2. Click "New repository". Name it anything (e.g. `stockdash`). Make it **Public**. Check "Add a README file". Click "Create".
3. On the repo page, click "Add file" → "Upload files". Drag all 8 files from this folder in. Click "Commit changes".
4. Go to Settings → Pages (left sidebar).
5. Under "Build and deployment" → Source, select "Deploy from a branch".
6. Branch: `main`, folder: `/ (root)`. Click Save.
7. Wait ~1-2 minutes. The page will refresh and show: "Your site is live at https://YOUR-USERNAME.github.io/stockdash/"
8. Open that URL on your phone in Chrome.
9. Chrome should show an "Install app" prompt within a few seconds of using the app. If not: Chrome menu (⋮) → "Install app" or "Add to Home Screen".
10. Done. You now have an icon on your phone that opens the app fullscreen.

## Deploy to Netlify (alternative, even faster)

1. Go to netlify.com/drop (no account needed for a quick test).
2. Drag the entire folder onto the page.
3. You get an instant HTTPS URL.
4. For a permanent site, sign up free and "claim" the site.

## Updating the app

After initial deploy, any change you push (e.g. edit `index.html` on GitHub) will be live in 1-2 minutes. Users see a "New version available — Refresh" banner automatically.

To force all users onto a new version immediately, edit `sw.js` and bump `CACHE_VERSION` from `v1` to `v2`.

## Troubleshooting

**"Install app" doesn't appear on Android Chrome:**
- Make sure you're on HTTPS (GitHub Pages is). `file://` and `http://` won't work.
- Use the app for ~30 seconds first — Chrome requires minimal engagement before offering install.
- Chrome menu → "Install app" or "Add to Home Screen" works manually.

**API calls fail with CORS / network error:**
- Verify your Anthropic API key starts with `sk-ant-` and has credits.
- Check https://status.anthropic.com
- Some mobile ad blockers / VPNs block api.anthropic.com. Disable and retry.

**App feels slow:**
- First load fetches everything from network (~1 second).
- Second load onwards opens instantly from cache.
- Only the API calls hit the network after that.

**I want to remove it:**
- Long-press the icon on your home screen → "Uninstall" (Android) or drag to trash (iOS).
- Or visit the URL in a regular browser tab → settings → clear site data.

## What data lives where

- **Your API key** → stored only in the browser's localStorage on YOUR device. Never sent anywhere except directly to api.anthropic.com.
- **Cached stock prices / analyses** → also in localStorage, on your device.
- **No analytics, no backend, no server.** The HTML you download IS the entire app.
