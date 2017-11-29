const NotificationHandler = {}
const newComment = 'New Comment'
const defaultTitle = ' New notification'
import { push } from 'react-router-redux'
//type classifies whether it is a comemnt ,share, file upload notifcaiont
//data determins logic for onClick events, ie link to comment
NotificationHandler.createNotification = (type, data, callback) => {
    let title = defaultTitle
    let options = {
        body: '',
        icon: '',
    }
    switch (type) {
        case 'comment':
            options.body = data.content
            title = 'new Comment from ' + data.target
            Notification.requestPermission(function (permission) {
                if (permission == 'granted') {
                    let commentNotify = new Notification(title, options)
                    commentNotify.onclick = function (event) {
                        callback(data)
                    }
                    setTimeout(commentNotify.close.bind(commentNotify), 5000)
                    return
                } else {
                    return
                }
            })
            break

        default:
            options.body = 'default notification'
            let defaultNotify = new Notification(title, options)

    }

}






export default NotificationHandler
