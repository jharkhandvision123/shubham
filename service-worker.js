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

const NOTIFICATION_PAGE =
    "https://jharkhandvision123.github.io/shubham/notification.html";


messaging.onBackgroundMessage(function(payload) {

    console.log(
        "Background message received:",
        payload
    );

    const notificationTitle =
        payload.notification?.title ||
        "S.P.D.D.C Notification";

    const notificationOptions = {

        body:
            payload.notification?.body || "",

        icon:
            "https://jharkhandvision123.github.io/shubham/images/app-icon-192.png.jpeg",

        data: {
            url: NOTIFICATION_PAGE
        }
    };

    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});


self.addEventListener(
    "notificationclick",
    function(event) {

        event.notification.close();

        const url =
            event.notification.data?.url ||
            NOTIFICATION_PAGE;

        event.waitUntil(

            clients.matchAll({
                type: "window",
                includeUncontrolled: true
            }).then(function(clientList) {

                for (const client of clientList) {

                    if (
                        client.url.startsWith(
                            "https://jharkhandvision123.github.io/shubham/"
                        ) &&
                        "focus" in client
                    ) {

                        return client.focus().then(function() {

                            return client.navigate(
                                NOTIFICATION_PAGE
                            );

                        });

                    }
                }

                return clients.openWindow(
                    NOTIFICATION_PAGE
                );

            })

        );
    }
);
