
@'
const CACHE_NAME = "automind-pwa-v2";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icons/icon-192.webp",
    "./icons/icon-512.webp"
];

// Install service worker and cache application files
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

// Activate and remove old application caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys =>
                Promise.all(
                    keys
                        .filter(key =>
                            key.startsWith("automind-pwa-") &&
                            key !== CACHE_NAME
                        )
                        .map(key => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

// Handle application requests
self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    // Ignore POST requests and external websites
    if (
        request.method !== "GET" ||
        url.origin !== self.location.origin
    ) {
        return;
    }

    // Network-first strategy for page navigation
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        const copy = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache =>
                                cache.put("./index.html", copy)
                            );
                    }

                    return response;
                })
                .catch(async () => {
                    return (
                        await caches.match("./index.html") ||
                        await caches.match("./")
                    );
                })
        );

        return;
    }

    // Cache-first strategy for local application files
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request).then(response => {
                    if (response.ok) {
                        const copy = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache =>
                                cache.put(request, copy)
                            );
                    }

                    return response;
                });
            })
    );
});
'@ | Set-Content -Encoding UTF8 sw.js