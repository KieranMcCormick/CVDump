const io = require('socket.io-client')
const commentNameSpace = io('/comments')
const notifcationSpace = io('/comments')

class SocketHandler {

    constructor(subscribeTo) {
        this.nameSpace = subscribeTo ? subscribeTo : 'notification'
        this.room = ''
        this.emitter = this.setEmitter()
    }

    setEmitter() {
        if (this.nameSpace == 'comments') {
            return commentNameSpace
        }
        else {
            return notifcationSpace
        }
    }

    joinRoom = (roomName) => {
        //tells server to listen to this nameSpace and listen to this room
        this.room = roomName
        this.emitter.emit('joinRoom', this.room)
    }


    leaveRoom () {
        //tells server to listen to this nameSpace and listen to this room
        this.emitter.emit('leaveRoom', this.room)
        this.room=''
    }

    emitEvent = (event, data) => {
        console.log(this.emitter)
        if (this.nameSpace == 'comments') {
            //send to everyone in the room
            this.emitter.emit(event, data)
        }
    }

    listen = (event, callback) => {
        this.emitter.on(event, (message) => {
            callback(message)
        })
    }
}

export default SocketHandler
