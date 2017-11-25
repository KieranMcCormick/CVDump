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
            
            options.body = data.content
            title = 'new Comment from' +  data.target 
            Notification.requestPermission(function(permission) {
                    if(permission == "granted"){
                        console.log("spawn notification");
                        let commentNotify = new Notification(title,options)
                        setTimeout(commentNotify.close.bind(commentNotify),3000)
                        return
                    } else {
                        return
                    }
                })          
        default:
            options.body ="new notification"
            let defaultNotify = new Notification(title,options)
           
    }

} 






export default NotificationHandler