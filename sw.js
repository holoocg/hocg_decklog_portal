// sw.js - install 事件
const CORE_CACHE = 'core-v1';
const IMAGE_CACHE = 'images-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CORE_CACHE).then(cache => {
      return cache.addAll(['./', './index.html', './single.html', './team.html', './miyagi_team.html']); // 填入你的核心文件路径
    })
  );
});

// sw.js - fetch 事件
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 判断是否为图片请求（根据文件后缀或路径特征）
  if (event.request.destination === 'image' || /\.(jpg|png|gif|webp)/.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // 命中缓存，直接返回（离线可用）
        }
        // 未命中，去网络抓取并存入缓存
        return fetch(event.request).then(networkResponse => {
          return caches.open(IMAGE_CACHE).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});
