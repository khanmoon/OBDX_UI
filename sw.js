(function () {
    "use strict";
    const CACHE_NAME = "obdx-cache",
        crucialResources = [];

    // Wait for installation until all the crucial resources are loaded and fetched
    self.addEventListener("install", function (event) {
        event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(crucialResources);
        }));
    });

    self.addEventListener("fetch", function (event) {
        event.respondWith(caches.match(event.request).then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(function (response) {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response;
                }
                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                if (event.request.url.match(/^((?!(digx|index\.html|home\.html|build\.fingerprint)).)*$/)) {
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            });
        }));
    });

    // Delete the existing caches on activation of new version of service worker.
    self.addEventListener("activate", function (event) {
        event.waitUntil(caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (cacheName) {
                return caches.delete(cacheName);
            }));
        }));
    });
})();