const CACHE='wive-v30';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./robinix-happy.png','./robinix-sad.png'];
const STATIC_HOSTS=['cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','www.gstatic.com','unavatar.io','assets.coingecko.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  const sameOrigin=url.origin===location.origin;
  if(!sameOrigin && !STATIC_HOSTS.includes(url.hostname)) return; // precios y APIs siempre en vivo
  e.respondWith(caches.open(CACHE).then(async cache=>{
    const cached=await cache.match(req,{ignoreSearch:false});
    const net=fetch(req).then(res=>{ if(res && (res.ok||res.type==='opaque')) cache.put(req,res.clone()); return res; }).catch(()=>cached);
    return cached||net;
  }));
});
