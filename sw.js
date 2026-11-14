/* Shrey's SF Events — minimal service worker.
   Network-first so event updates always show when online;
   the last good page is kept as an offline fallback. */
var CACHE = 'sf-events-v1';

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.add('./'); }).catch(function () {})
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (e.request.mode === 'navigate') {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./', copy); }).catch(function () {});
      }
      return res;
    }).catch(function () {
      return caches.match('./', { ignoreSearch: true });
    })
  );
});
