self.addEventListener('install',async function(e){
    console.log('SW install');    
    //Agregar los archivos a la cache
    e.waitUntil((async function(){
        const cache = await caches.open('CACHE_APP_LOTES');
        return cache.add('https://fedecascardo.github.io/css/main.css');
        return cache.add('https://fedecascardo.github.io/index.html');
        return cache.add('https://fedecascardo.github.io/');
        return cache.add('https://fedecascardo.github.iofavicon.ico');
        return cache.add('https://fedecascardo.github.iomanifest.json');
        return cache.add('https://fedecascardo.github.io/js/main.js');
    })()); 
})

self.addEventListener('activate', e=> {
    console.log('SW Activate');    
    //Actualizar la caché. Realizar cambios necesarios en nuevas versiones de cache
})

self.addEventListener('fetch', e=>{
    //Responder priorizando la caché por sobre la red - cache first
    //Intercepta una petición http
    console.log('SW fetch');  
    //let request =  e.request;
    //console.log(request.url)
    //let response;
    //Esto sería el comportamiento por defecto. Responder con e.request
    //e.respondWith(fetch(e.request));
    const respuesta = caches.open('CACHE_APP_LOTES').then(
        cache => {
            caches.match(e.request.url)
        }
    )
    e.respondWith(respuesta);
})