self.addEventListener("fetch",e=>{
e.respondWith(caches.open("face-target").then(c=>c.match(e.request).then(r=>r||fetch(e.request))));
});
