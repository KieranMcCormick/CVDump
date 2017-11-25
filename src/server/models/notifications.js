const { sqlInsert, sqlSelect } = require('../db')
const _ = require('lodash')
const fetchUserQuery = 'SELECT uuid FROM users WHERE email_address = ?'

class Notifications {
    constructor(props) {
        if (props) {
            this.documentId = props.documentId ? props.documentId : null
            this.timeStamp = props.timeStamp ? props.timeStamp : ''
            this.type = props.type ? props.type : "system"
            this.sender = props.sender ? props.sender: ''
            this.email = props.email ? props.email : ''
            
    }
    //checks if document exists
   
    //checks if user exists ,returns iD
   }

   

    create() {
        // might query using username instead ?
        const createQuery = 'INSERT INTO notifications (uuid, user_id, document_id, type, created_at) VALUES (UUID(), ?, ?, ?, ?)'
       
        return new Promise((resolve, reject) => {
            // notifications has to have userid, docid and a type of notification
            if( !this.documentId || !this.type) {
                return reject({message:"Missing userID and docID"})
            }

            this.getDocOwner(this.documentId).then ((success, err) => {
                    if (err) {
                        return resolve({ message: err })
                    }
                    if (success) {
                        
                        let uuid = success[0].uuid
                        let username = success[0].username
                        if(username =! this.sender) {
                            //No need to emit your own notification
                            return reject({message:"Cannot create notifcation for yourself"})
                        } else {
                            //go ahead and create the notification
                            sqlInsert(createQuery, [uuid, this.documentId, this.type,this.timeStamp], (err, result) => {
                                if (err) {
                                    console.log(err)
                                    return resolve({ params: [username, this.documentId, ,this.type, this.timeStamp], error: err })
                                }
                                if(result){
                                    return resolve({ 
                                            target: success[0].username,
                                            type:this.type,
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
        const fetchNotificationQuery = 'SELECT user_id, type, created_at, document_id FROM notifications WHERE user_id = ?'
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
                            return reject({message:"fail to fetch notifications"})
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

    parseOutput(rows) {
        let that= this
        return _.map(rows, function (entries) {
            //convert blob to string
            return {
                email: that.email,
                type: entries.type,
                timeStamp: entries.created_at,
                document_id:entries.document_id,
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
