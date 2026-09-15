importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyD8YmnfyVnEXKIxBsKeAdQZYVo1CHjmYXg",
    authDomain: "spddc-notification.firebaseapp.com",
    projectId: "spddc-notification",
    storageBucket: "spddc-notification.firebasestorage.app",
    messagingSenderId: "329322876402",
    appId: "1:329322876402:web:736db8f195a23a18206f6b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log("Background message received:", payload);

    const notificationTitle =
        payload.notification?.title || "S.P.D.D.C Notification";

    const notificationOptions = {
        body: payload.notification?.body || "",
        icon: "/images/app-icon-192.png.jpeg",
        data: {
            url: payload.data?.url || "/index.html"
        }
    };

    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});

self.addEventListener("notificationclick", function(event) {
    event.notification.close();

    const url =
        event.notification.data?.url || "/index.html";

    event.waitUntil(
        clients.openWindow(url)
    );
});
