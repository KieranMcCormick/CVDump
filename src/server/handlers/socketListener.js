class SocketListener {
    constructor(server) {
        this.commmentSpace = ''
        this.notificationSpace = ''
        this.io = require('socket.io')(server)
        this.intialize_namespaces()
        this.start_listeners()
    }
    //Starts all name spaces
    intialize_namespaces() {
        this.commentSpace = this.io.of('/comments')
        this.notificationSpace = this.io.of('/notifications')
    }

    start_listeners() {
        this.comments_listener()
        this.notification_listener()
    }

    comments_listener() {

        this.commentSpace.on('connection', function (socket) {
            console.log('conneted to comments space')
            socket.on('joinRoom', function (room) {
                console.log('received join room event')
                socket.join(room)
            })

            socket.on('leaveRoom', function (room) {
                socket.leave(room)
            })
            socket.on('comment', function (msg) {
                // logic to redirect message
                console.log('redirecting')
                console.log(msg)
                socket.to(msg.roomId).emit('update', msg)
            })

            socket.on('error', function (err) {
                console.log(err)
            })
        })

    }

    notification_listener() {
        this.notificationSpace.on('connection', function (socket) {
            //users subscribe to this channel when they log on the first time
            //room names will be their userIds
            socket.on('getNotifications', function (user) {
                console.log('listening to notifications')
                socket.join(user)
            })
            //Notifications should be sent to global name space and redirected to specific users
            //fired by comment creation
            socket.on('onRecieveNotifaction', function (msg) {
                //get target userId from msg, reply message to specific room
                socket.to(msg.toUser).emit('notify', msg)
            })
        })
    }


}

module.exports = SocketListener
