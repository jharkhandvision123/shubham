```javascript id="e5q2nw"
const CACHE_NAME = "jv123-v1";

self.addEventListener("install", function(event) {
    console.log("JV 123 Service Worker: Installed");
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    console.log("JV 123 Service Worker: Activated");

    event.waitUntil(
        self.clients.claim()
    );
});
```
