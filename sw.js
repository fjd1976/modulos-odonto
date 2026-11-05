// Service worker mínimo: permite instalar la app. Guarda la pantalla para abrirla rápido;
// los datos siempre se piden al servidor (nunca se guardan datos de pacientes en el celular).
const CACHE = 'modulos-v4';
const BASE = ['./', './index.html', './manifest.webmanifest', './icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // Primero la red (para recibir siempre la última versión); si no hay conexión, la copia guardada.
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request)));
});
