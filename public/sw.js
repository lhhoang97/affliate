// Service Worker for caching and performance optimization
const CACHE_NAME = 'bestfinds-v1';
const STATIC_CACHE = 'bestfinds-static-v1';
const DYNAMIC_CACHE = 'bestfinds-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Serving from cache:', request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Determine cache strategy based on request type
            const cacheStrategy = getCacheStrategy(request);
            
            if (cacheStrategy.shouldCache) {
              caches.open(cacheStrategy.cacheName)
                .then((cache) => {
                  console.log('Caching response:', request.url);
                  cache.put(request, responseToCache);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            throw error;
          });
      })
  );
});

// Cache strategy based on request type
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Static assets (JS, CSS, images)
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return {
      shouldCache: true,
      cacheName: STATIC_CACHE,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
  }
  
  // API requests
  if (url.pathname.startsWith('/api/')) {
    return {
      shouldCache: true,
      cacheName: DYNAMIC_CACHE,
      maxAge: 5 * 60 * 1000 // 5 minutes
    };
  }
  
  // HTML pages
  if (request.destination === 'document') {
    return {
      shouldCache: true,
      cacheName: DYNAMIC_CACHE,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    };
  }
  
  // Default: don't cache
  return {
    shouldCache: false,
    cacheName: null,
    maxAge: 0
  };
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(
      // Handle offline actions when connection is restored
      handleBackgroundSync()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle background sync
async function handleBackgroundSync() {
  try {
    // Get pending offline actions from IndexedDB
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        await processOfflineAction(action);
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to process offline action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for offline actions
async function getPendingActions() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

async function processOfflineAction(action) {
  // Process the offline action (e.g., sync cart, send analytics)
  console.log('Processing offline action:', action);
}

async function removePendingAction(actionId) {
  // Remove the processed action from IndexedDB
  console.log('Removing processed action:', actionId);
}
