// Service Worker for PMU Student Hub
const CACHE_NAME = 'pmu-student-hub-v2';
const urlsToCache = [
  // الصفحات الرئيسية
  './',
  './index.html',
  './admin-login.html',
  './admin-panel.html',
  
  // أنماط CSS
  './global.css',
  './home.css',
  './search.css',
  './profile.css',
  './map.css',
  './admin.css',
  
  // ملفات JavaScript
  './script.js',
  './admin.js',
  
  // الصور والأيقونات
  './icon.png',
  './logo.png',
  './P2.png',
  './B1.jpg',
  './A3.jpg',
  './room1.png',
  './room2.png',
  './room3.png',
  './map4.png',
  
  // ملفات PWA
  './manifest.json',
  './sw.js'
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened, adding files...');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache addAll failed:', error);
      })
  );
  self.skipWaiting(); // تفعيل Service Worker فورًا
});

// Fetch files with network-first strategy for dynamic content
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // استراتيجية مختلفة للملفات الديناميكية (مثل admin-panel)
  if (url.includes('admin-panel.html') || url.includes('admin-login.html')) {
    // Network first for admin pages
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache first for static files
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            // Cache new files dynamically
            if (event.request.method === 'GET') {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return fetchResponse;
          });
        })
        .catch(error => {
          console.error('Fetch failed:', error);
          // يمكن إرجاع صفحة offline مخصصة هنا إذا أردت
          return new Response('Network error occurred', { status: 408, statusText: 'Timeout' });
        })
    );
  }
});

// Activate Service Worker and clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(clients.claim()); // السيطرة على الصفحات المفتوحة فورًا
});

// رسالة من Service Worker
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
