this.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('CACHE_APP_LOTE').then(function(cache) {
        return cache.addAll([
            'https://fedecascardo.github.io/css/main.css',
            'https://fedecascardo.github.io/index.html',
            'https://fedecascardo.github.io/',
            'https://fedecascardo.github.io/js/main.js',
            'https://fedecascardo.github.io/favicon.ico'
        ]);
    })
  );
});

  //CACHE_APP_LOTE

self.addEventListener('activate', e=> {
    console.log('SW Activate');    
    //Actualizar la caché. Realizar cambios necesarios en nuevas versiones de cache
})

// self.addEventListener('fetch', e=>{
//     //Responder priorizando la caché por sobre la red - cache first
//     //Intercepta una petición http
//     //console.log('SW fetch');  
//     //let request =  e.request;
//     //console.log(request.url)
//     //let response;
//     //Esto sería el comportamiento por defecto. Responder con e.request
//     //e.respondWith(fetch(e.request));
//     console.log(e.request.url)
//     const respuesta = caches.open('CACHE_APP_LOTES').then(
//         cache => {
//             caches.match(e.request.url)
//         }
//     )
//     e.respondWith(respuesta);
// })

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});