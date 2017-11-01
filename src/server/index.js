const ROOT_DIR = `${__dirname}/../..`

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

// Serve static content
app.use('/', express.static(`${ROOT_DIR}/src/public`))

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`[ OK ] App is listening on port: ${PORT} 👂`)
    console.log(`http://localhost:${PORT}`)
})
