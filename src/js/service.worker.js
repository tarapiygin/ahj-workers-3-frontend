const version = 'v2';
const cacheName = `ahj-${version}`;
const files = [
  '/',
  '/favicon.ico',
  '/main.css',
  '/main.js',
];

async function putFilesToCache(data) {
  const cache = await caches.open(cacheName);
  await cache.addAll(data);
}

async function removeOldCache(retain) {
  const keys = await caches.keys();
  return Promise.all(
    keys.filter((key) => !retain.includes(key))
      .map((key) => caches.delete(key)),
  );
}

self.addEventListener('install', (evt) => {
  evt.waitUntil((async () => {
    await putFilesToCache(files);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil((async () => {
    await removeOldCache([cacheName]);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (evt) => {
  const requestUrl = new URL(evt.request.url);
  if (requestUrl.pathname.startsWith('/news')) {
    return;
  }

  evt.respondWith((async () => {
    const cache = await caches.open(cacheName);
    try {
      const response = await fetch(evt.request);
      if (response.ok) evt.waitUntil(cache.put(evt.request, response.clone()));
      return response;
    } catch (e) {
      const cachedResponse = await cache.match(evt.request);
      if (cachedResponse) return cachedResponse;
      throw new Error(e.message);
    }
  })());
});

self.addEventListener('fetch', (evt) => {
  const requestUrl = new URL(evt.request.url);
  if (!requestUrl.pathname.startsWith('/news')) {
    return;
  }

  evt.respondWith((async () => {
    const cache = await caches.open(cacheName);
    try {
      const response = await fetch(evt.request);
      if (response.ok) {
        evt.waitUntil(cache.put(evt.request, response.clone()));
        return response;
      }
      throw new Error();
    } catch (e) {
      const cachedResponse = await cache.match(evt.request);
      if (cachedResponse) return cachedResponse;
      throw new Error(e.message);
    }
  })());
});
