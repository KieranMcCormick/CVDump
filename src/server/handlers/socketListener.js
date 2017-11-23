const logger = (message) => {console.log(`[Socket] ${message}`)}
const Document = require('../models/document')
class SocketListener {
    constructor(server) {
        this.io = require('socket.io')(server)

        // Initialize namespaces
        this.commentSpace = this.io.of('/comments')
        this.notificationSpace = this.io.of('/notifications')
        this.start_listeners()
    }

    start_listeners() {
        this.comments_listener()
        this.notification_listener()
    }

    comments_listener() {
        this.commentSpace.on('connection', function (socket) {
            logger('Connect to comments space')
            let newUser = room.user
            let newRoom = room.roomId
            socket.on('joinRoom', function (room) {
                logger(`${newUser} room event room id: ${newRoom}`)
            })

            socket.on('leaveRoom', function (room) {
                let newUser = room.user
                let newRoom = room.roomId
                logger(`Leave room event room id: ${room}`)
                socket.leave(room)
            })

            socket.on('comment', function (msg) {
                logger(`Add a comment to file:${msg.roomId}`)
                // Sends to all clients in 'roomId' room except sender
                socket.to(msg.roomId).emit('update', msg.comment)
                // check if user is in Room, if not in room fire notification chain, else skip notification
            })

            socket.on('error', function (err) {
                console.error(err)
            })
        })

    }

    notification_listener() {
        this.notificationSpace.on('connection', function (socket) {
            //users subscribe to this channel when they log on the first time
            //room names will be their userIds

            socket.on('joinRoom', function (room) {
                socket.join(room)
            })
                
            socket.on('leaveRoom', function (room) {
                socket.leave(room)
            })

            socket.on('getNotifications', function (user) {
                logger('Listen to notifications')
                //get file Owner from docId
                Document.getDocOwner(user.docId)

            })

            //Notifications should be sent to global name space and redirected to specific users
            //fired by comment creation
            socket.on('onReceiveNotification', function (msg) {
                //get target userId from msg, reply message to specific room
                socket.to(msg.toUser).emit('notify', msg)
            })
        })
    }

}

module.exports = SocketListener
