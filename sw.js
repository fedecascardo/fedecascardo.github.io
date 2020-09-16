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
    const cache = await caches.open('SUPER_LISTA_CACHE');
    cache.add('/css/main.css');

})

self.addEventListener('activate', e=> {
    console.log('SW Activate');    
    //Actualizar la caché. Realizar cambios necesarios en nuevas versiones de cache
})

self.addEventListener('fetch', e=>{

    //Responder priorizando la caché por sobre la red - cache first

    console.log('SW fetch');   
    console.log(fetchEvent);   
    let request =  e.request;
    console.log(request.url)
    let response;

    e.respondWith(fetch(request))
})