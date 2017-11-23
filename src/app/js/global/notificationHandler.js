const NotificationHandler = {}
const newComment = "New Comment"
const defaultTitle =" New notification"
//type classifies whether it is a comemnt ,share, file upload notifcaiont
//data determins logic for onClick events, ie link to comment
NotificationHandler.createNotification = (type,data) => {
    let title = defaultTitle
    let  options = {
        body:'',
        icon:'',
    }
    switch (type) {
        case "comment":
            options.body = data.newComment
            title = newComment +' from' + data.sender
            let commentNotify = new Notification(title,options)
            setTimeout(commentNotify.close.bind(commentNotify),5000)
            return
        default:
            options.body ="new notification"
            let defaultNotify = new Notification(title,options)
            setTimeout(defaultNotify.close.bind(defaultNotify),3000)
    }

} 






export default NotificationHandler