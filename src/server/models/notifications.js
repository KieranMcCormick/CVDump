const { sqlInsert, sqlSelect ,sqlDelete} = require('../db')
const _ = require('lodash')
const fetchUserQuery = 'SELECT uuid FROM users WHERE email_address = ?'

class Notifications {
    constructor(props) {
        if (props) {
            this.documentId = props.documentId ? props.documentId : null
            this.timeStamp = props.timeStamp ? props.timeStamp : ''
            this.type = props.type ? props.type : 'system'
            this.sender = props.sender ? props.sender: ''
            this.email = props.email ? props.email : ''

        }
    //checks if document exists

    //checks if user exists ,returns iD
    }


    create() {
        // might query using username instead ?
        return new Promise ((resolve,reject)=>{
            this.getUUid().then((success,err)=>{
                if(success){
                    console.log(success)
                    return resolve(this.createNotification(success))
                }
                if(err){
                    reject(null)
                }
            })
        })
    }

    getUUid () {
        const newId = 'SELECT UUID() AS uuid'
        return new Promise((resolve, reject) =>{
            sqlSelect(newId,null, (err,result)=>{
                if(err){
                    return reject(null)
                }
                if(result){

                    return resolve(result[0].uuid)
                }
            })
        })


    }

    createNotification(uuid) {
        const createQuery = 'INSERT INTO notifications (uuid, user_id, document_id, sender, type, created_at) VALUES (?, ?, ?, ?, ?,?)'

        return new Promise((resolve, reject) => {
            // notifications has to have userid, docid and a type of notification
            if( !this.documentId || !this.type) {
                return reject({message:'Missing userID and docID'})
            }

            this.getDocOwner(this.documentId).then ((success, err) => {
                if (err) {
                    return resolve({ message: err })
                }
                if (success) {

                    let userId = success[0].uuid
                    let username = success[0].username

                    if(username =! this.sender) {
                        //No need to emit your own notification
                        return reject({message:'Cannot create notifcation for yourself'})

                    } else {
                        //go ahead and create the notification
                        sqlInsert(createQuery, [uuid,userId, this.documentId,this.sender, this.type,this.timeStamp], (err, result) => {
                            if (err) {
                                console.log(err)
                                return resolve({ params: [username, this.documentId, this.type, this.timeStamp], error: err })
                            }
                            if(result){
                                return resolve({
                                    uuid:uuid,
                                    target: success[0].username,
                                    type:this.type,
                                    sender:this.sender,
                                    documentId: this.documentId,
                                    timeStamp:this.timeStamp,
                                })
                            }
                        })
                    }
                }
            })
        })



    }



    load() {
        let that = this
        const fetchNotificationQuery = 'SELECT notifications.uuid, notifications.user_id, type, sender, notifications.created_at, document_id, title FROM notifications  LEFT JOIN documents ON notifications.document_id = documents.uuid WHERE notifications.user_id = ? ORDER BY notifications.created_at DESC'
        console.log(this.email)
        return new Promise((resolve, reject) => {
            sqlSelect(fetchUserQuery, [this.email], (err, success) => {
                if (err) {
                    console.log(err)
                    return reject({ message: 'No such user' })
                }
                if (success[0]) {
                    console.log(success[0])
                    let uuid = success[0].uuid
                    sqlSelect(fetchNotificationQuery, [uuid], (err, result) => {
                        if(err) {
                            console.log(err)
                            return reject({message:'fail to fetch notifications'})
                        }
                        if(result){
                            console.log(result)
                            return resolve({notifications:that.parseOutput(result)})
                        }
                    })
                } else {
                    return reject(new Error('Internal Server Error'))
                }
            })
        })
    }

    delete(id){
        const deleteNotification = 'DELETE FROM notifications WHERE uuid = ?'
        return new Promise((resolve, reject)=> {
            sqlDelete(deleteNotification,[id],(err,result) => {
                if(err) {
                    console.log(err)
                    return reject({message:'fail to fetch notifications'})
                }
                if(result){
                    console.log(result)
                    return resolve({result})
                }

            })

        })



    }

    parseOutput(rows) {
        let that= this
        return _.map(rows, function (entries) {
            //convert blob to string
            return {
                email: that.email,
                type: entries.type,
                timeStamp: entries.created_at,
                document_id:entries.document_id,
                file: entries.title,
                uuid:entries.uuid,
            }
        })
    }

    getDocOwner(doc_id) {
        const FIND_DOC_OWNER = 'SELECT users.uuid, username FROM documents, users where documents.uuid = ? AND documents.user_id = users.uuid'
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_DOC_OWNER, [ doc_id ], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result/** || result**/) { // Check valid result ... ?
                    return reject(new Error('Unknown Error'))
                }
                return resolve(result)
            })
        })
    }
}

module.exports = Notifications
