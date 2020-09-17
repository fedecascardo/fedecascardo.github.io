const archivos=[
    '/css/main.css',
    '/index.html',
    '/',
    'sw.js',
    'favicon.ico',
    'manifest.json',
    '/js/main.js'
]

self.addEventListener('install',async function(e){
    console.log('SW install');    
    //Agregar los archivos a la cache
    e.waitUntil((async function(){
        const cache = await caches.open('CACHE_APP_LOTES');
        return cache.addAll(archivos);
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
    console.log(e.request.url);   
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