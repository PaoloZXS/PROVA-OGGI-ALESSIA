self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  
  // Escludi le API dal caching - sempre prendi dal server
  if (event.request.url.includes('/api/')) {
    return event.respondWith(fetch(event.request));
  }
  
  event.respondWith(
    caches.open('pwa-cache').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
