'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    async function regServiceWorker() {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            'serviceWorker.js',
            {
              scope: './',
            }
          );
          if (registration.installing) {
            console.log('Service worker installing...');
          } else if (registration.waiting) {
            console.log('Service worker installed.');
          } else if (registration.active) {
            console.log('Service worker active.');
          }

          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log(event.data);
          });
        } catch (error) {
          console.error(`Registration failed with ${error}`);
        }
      }
    }

    regServiceWorker();
  }, []);

  return null;
}
