// Service worker minimal — évite les 404 répétés (extensions / navigateur)
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())
