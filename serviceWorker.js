const staticTodoApp = "todo-app-v1"
const assets = [
  "/",
  "index.html",
  "assets/style.css",
  "assets/script.js",
  "assets/icon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticTodoApp).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})

new Notification("hello")