const PUBLIC_DIR = `${__dirname}/../public`

//node module dependency
const express = require('express')
const app = express()
const cookieSession = require('cookie-session')
const bodyParser  = require('body-parser')
const logger = require('morgan')
const keys = require('./config/keys')
const server = require('http').Server(app)
const io = require('socket.io')(server)
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
app.use(logger('common'))

require('./handlers/passport')(app)

if (process.env.NODE_ENV !== 'production') {
    // Hot reload in development
    require('./handlers/webpack')(app)
}

// // Insert CSRF middleware
// app.use(require('csurf')())

if (process.env.NODE_ENV === 'production') {// Only use these in production
    app.set('trust proxy', 'loopback')
    app.use(require('helmet')())
    app.use(require('compression')())
}

// routes setup
app.use(require('./routes/auth'))
app.use(require('./routes/sessions'))
app.use('/comment',require('./routes/comment_api'))
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
    sendFile(PUBLIC_DIR, 'index.html', response)
})

server.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`[ OK ] App is listening on port: ${PORT} 👂`)
    console.log(`http://localhost:${PORT}`)
})

let commentSpace = io.of('/comments')

commentSpace.on('connection', function(socket) {
    console.log('conneted to comments space')

    socket.on('joinRoom', function(room) {
        console.log('received join room event')
        socket.join(room)
    })

    socket.on('comment' ,function(msg) {
        // logic to redirect message
        socket.to(msg.roomId).emit('update',msg)
    })


})

let notificationSpace = io.of('/notifications')

notificationSpace.on('connection',function(socket){
    //users subscribe to this channel when they log on the first time
    //room names will be their userIds
    socket.on('getNotifications',function(user){
        console.log('listening to notifications')
        socket.join(user)
    })
    //Notifications should be sent to global name space and redirected to specific users
    //fired by comment creation
    socket.on('onRecieveNotifaction',function(msg){
        //get target userId from msg, reply message to specific room
        socket.to(msg.toUser).emit('notify',msg)
    })
})
