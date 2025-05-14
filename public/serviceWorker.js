self.addEventListener('install', (event) => {
  console.log('service worker installed');
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
  console.log('service worker activated!');

  event.waitUntil(clients.claim()); // Take control of the page

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage({ msg: 'From worker!' }));
  });
});

self.addEventListener('fetch', async (event) => {
  // Get the request method
  const method = event.request.method;
  const request = event.request;
  const pathname = new URL(event.request.url).pathname;

  if (!pathname?.includes('/api')) return;

  if (!event.request.body) {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => client.postMessage({ method, pathname }));
    });

    return;
  }

  const body = await new Response(event.request.body)?.json();
  const itemId = body._id;

  // Send message to the client
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) =>
      client.postMessage({ method, pathname, itemId })
    );
  });
});
