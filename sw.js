// Simple service worker: app shell cache so the menu opens even on weak internet.
const V = "kq-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(
      fetch(r)
        .then((res) => { const c = res.clone(); caches.open(V).then((ca) => ca.put("/index.html", c)); return res; })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }
  e.respondWith(
    caches.match(r).then((hit) => {
      const net = fetch(r)
        .then((res) => { if (res.ok) { const c = res.clone(); caches.open(V).then((ca) => ca.put(r, c)); } return res; })
        .catch(() => hit);
      return hit || net;
    })
  );
});
