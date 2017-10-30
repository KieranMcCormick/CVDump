const ROOT_DIR = `${__dirname}/../..`
const PUBLIC_DIR = `${__dirname}/../public`

//node module dependency
const express = require('express')
const app = express()
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser  = require('body-parser')
const keys = require('./config/keys')

const PORT = process.env.PORT || 9999

//middleware
app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,   // in ms, 1 day
        keys: [keys.cookieKey],
        sameSite: 'lax',
    })
)
app.use(bodyParser.json())

if (process.env.NODE_ENV !== 'production') {
    // Log all incoming requests
    app.use(function(request, response, next) {
        console.log(`\n[ ${request.method} ] ${request.url}\n`)
        next()
    })
    // Hot reload in development
    require('./handlers/webpack')(app)
}

if (process.env.NODE_ENV === 'production') {// Only use these in production
    app.use('trust proxy', 'loopback')
    app.use(require('helmet')())
    app.use(require('compression')())
}

// routes setup
require('./routes')(app)

// Default files
// ---
const sendFile = (rootDir, relPath, response) => {
    response.sendFile(relPath, { root: rootDir })
}
app.get('/:filename(main.js|styles.css)', (request, response) => {
    sendFile(PUBLIC_DIR, request.url, response)
})

app.get(['/assets/:filename', '/assets/*/:filename'], (request, response) => {
    sendFile(PUBLIC_DIR, request.url, response)
})

app.get('*', (request, response) => {
    sendFile(PUBLIC_DIR, 'index.html', response);
})

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`[ OK ] App is listening on port: ${PORT} 👂`)
    console.log(`http://localhost:${PORT}`)
})
