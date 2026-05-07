/* eslint-disable */
/**
 * Service worker — keeps the menu working without internet.
 *
 * Strategy:
 *   • HTML (the navigation request) → network-first so customers
 *     always see the latest version of the menu when online; falls
 *     back to the cached copy when there's no signal.
 *   • Everything else (JS/CSS bundles with hashed names, images,
 *     icons, manifest, fonts) → cache-first. They never change for
 *     the same hash, so this is safe and instant.
 *   • Old caches are deleted on activate so a re-deploy doesn't grow
 *     the device cache forever.
 */
const VERSION = 'v4';
const RUNTIME = `areeka-runtime-${VERSION}`;
const PRECACHE = `areeka-precache-${VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './logo.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== PRECACHE && k !== RUNTIME)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isFont =
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  // Navigation (HTML) → network-first
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((m) => m || caches.match('./index.html')),
        ),
    );
    return;
  }

  // Same-origin assets + Google Fonts → cache-first
  if (isSameOrigin || isFont) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            // Only cache successful, basic/cors responses
            if (
              res &&
              res.status === 200 &&
              (res.type === 'basic' || res.type === 'cors')
            ) {
              const copy = res.clone();
              caches.open(RUNTIME).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
      }),
    );
  }
});
