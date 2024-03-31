// installation
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// activation
self.addEventListener("activate", (e) => {});

// fetch

self.addEventListener("fetch", (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
