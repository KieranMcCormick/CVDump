const CACHE_NAME = 'poopnado-cache-v1'
const DATABASE_NAME = 'poopdatabase'

// vendor util scripts
importScripts('./vendor/sw-toolbox.js')

self.log = (message) => console.log(`[Service Worker] ${message}`)

self.toolbox.precache([
    '/',
    '/main.js',
    '/styles.css',
    '/assets/favicon.ico',
    '/assets/cache/pusheen.jpg',
    '/assets/cache/css.gif',
    '/assets/cache/sauce.gif',
    '/assets/cache/whatyougot.gif'
])

// Set up
// ---
self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})


// Background sync
// --
self.addEventListener('sync', event => {
    // sync event fired
    switch(event.tag){
        case 'message-fetch':
            event.waitUntil(postMessage())
            break
        default:
            return
    }
})

const postMessage = () => {
    return getAllPendingMessage()
        .then(records => {
            return fetch('/test', {
                method: 'POST',
                body: JSON.stringify(records),
                headers: {'Content-Type': 'application/json'}
            })
        })
        .then(response => response.json())
        .then(data => {
            sendPendingMessage(data)
        })
        .catch(error => {
            self.log(`Message fetch failed ${error}`)
        })
}

const getAllPendingMessage = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, 1)
        request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(DATABASE_NAME, 'readonly')
            const store = transaction.objectStore(DATABASE_NAME)
            const getAllRequest = store.getAll()

            getAllRequest.onsuccess = (event) => {
                resolve(event.target.result)
            }

            getAllRequest.onerror = (event) => {
                reject('Failed to get the records')
            }
        }

        request.onerror = (event) => {
            reject('Failed to open storage.')
        }

        request.onupgradeneeded = (event) => {
            const db = request.result
            const store = db.createObjectStore(DATABASE_NAME, {keyPath: "id"})
            const index = store.createIndex("MessageIndex", "message")
        }
    })
}

// Communicate with message channels
const sendPendingMessage = (data) => {
    const messageJSONfy = JSON.stringify(data)

    // From MDN: worker.clients.matchAll()
    // Returns a Promise for an array of Client objects.
    // An options argument allows you to control the types of
    // clients returned.
    self.clients
        .matchAll()
        .then(clients => {
            Promise.all(
                clients.map(client => {
                    client.postMessage(messageJSONfy)
                })
            )
        })
        .then(() => {
            pushNotification(data)
        })
}

// Push Notification
// ---
const pushNotification = messages => {
    // Send a notification per message
    messages.forEach(message => {
        const title = 'Poopnado'
        const options = {
            body: message.message,
            icon: '/assets/push.png'
        }
        this.registration.showNotification(title, options)
    }, self)
}

// Network cache
// ---
self.toolbox.router.get('/', self.toolbox.fastest)
self.toolbox.router.get('/:filename(styles.css|main.js)', self.toolbox.cacheFirst)
self.toolbox.router.get('/assets/:filename', self.toolbox.networkOnly)
self.toolbox.router.get('/assets/favicon.ico', self.toolbox.cacheOnly)
self.toolbox.router.get('/assets/cache/:filename', self.toolbox.cacheOnly)
self.toolbox.router.get('/(.*)', self.toolbox.fastest)
