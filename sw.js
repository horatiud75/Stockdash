/**
 * Service Worker for Stock Dashboard Pro PWA.
 *
 * Strategy:
 *  - UI shell (HTML, icons, manifest): cache-first with background update.
 *    Offline user sees the last cached version instantly.
 *  - API calls (api.anthropic.com): never cached — always go to network.
 *    We don't want stale price data or old analyses.
 *
 * To force all clients to refresh, bump CACHE_VERSION below.
 */

const CACHE_VERSION = "v5-haiku";
const CACHE_NAME = `stockdash-${CACHE_VERSION}`;

// Files that make up the "app shell" — cached on install.
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './favicon.png',
];

// On install: pre-cache the shell, then activate immediately.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] install cache failed:', err))
  );
});

// On activate: clear old cache versions and take control of all open pages.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k.startsWith('stockdash-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// On fetch: apply caching strategy based on request type.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never intercept non-GET requests (POST to Anthropic API etc.)
  if (req.method !== 'GET') return;

  // Never cache API calls — always go to network.
  if (url.hostname === 'api.anthropic.com') return;

  // Only handle same-origin requests for the shell.
  if (url.origin !== self.location.origin) return;

  // Cache-first with network fallback + background update.
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((response) => {
        // Only cache successful, basic responses.
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return response;
      }).catch(() => cached); // offline? fall back to cache
      return cached || fetchPromise;
    })
  );
});

// Optional: listen for "skipWaiting" message from the page to force an update.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
