const BUILD6_CACHE = "build6-companion-shell-v1";

const SAFE_SHELL_FILES = [
  "/offline",
  "/build6-icon-180.png",
  "/build6-icon-192.png",
  "/build6-icon-512.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(BUILD6_CACHE)
      .then((cache) => cache.addAll(SAFE_SHELL_FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("build6-companion-") &&
                key !== BUILD6_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  // Never cache student API responses, authentication, messages,
  // assignments, profiles, reflections, or other private data.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/ambassador/")
  ) {
    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request).catch(() => caches.match("/offline")),
      );
    }

    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline")),
    );

    return;
  }

  if (
    SAFE_SHELL_FILES.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request);
      }),
    );
  }
});

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let data = {};

  try {
    data = event.data.json();
  } catch {
    data = {
      title: "BUILD6",
      body: event.data.text(),
    };
  }

  const title = data.title || "BUILD6 Student Companion";

  const options = {
    body: data.body || "You have something new in BUILD6.",
    icon: "/build6-icon-192.png",
    badge: "/build6-icon-192.png",
    data: {
      url: data.url || "/ambassador",
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target =
    event.notification?.data?.url || "/ambassador";

  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }

      return self.clients.openWindow(target);
    }),
  );
});
