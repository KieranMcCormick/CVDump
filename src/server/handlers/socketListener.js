const logger = (message) => {console.log(`[Socket] ${message}`)}

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
            socket.on('joinRoom', function (room) {
                logger(`Join room event room id: ${room}`)
                socket.join(room)
            })

            socket.on('leaveRoom', function (room) {
                logger(`Leave room event room id: ${room}`)
                socket.leave(room)
            })

            socket.on('comment', function (msg) {
                logger(`Add a comment to file:${msg.roomId}`)
                // Sends to all clients in 'roomId' room except sender
                socket.to(msg.roomId).emit('update', msg.comment)
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
            socket.on('getNotifications', function (user) {
                logger('Listen to notifications')
                socket.join(user)
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
