self.addEventListener('install', e=>{
    console.log('SW install');    
})

self.addEventListener('activate', e=>{
    console.log('SW Activate');    
})

self.addEventListener('fetch', e=>{
    console.log('SW fetch');   
    let request =  e.request;
    e.respondWith(fetch(request))
})