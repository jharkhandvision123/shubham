```javascript id="m7q4vx"
const CACHE_NAME = "student-portal-v1";

self.addEventListener("install", function (event) {
    console.log("Service Worker: Installing");
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    console.log("Service Worker: Activated");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});
```
