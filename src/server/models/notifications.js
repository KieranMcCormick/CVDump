const { sqlInsert, sqlSelect } = require('../db')
const _ = require('lodash')
const fetchUserQuery = 'SELECT uuid FROM users WHERE username = ?'
class Notifications {
    constructor(props) {
        if (props) {
            this.targetUser = props.targetUser ? props.targetUser : null
            this.documentId = props.documentId ? props.documentId : null
            this.timeStamp = props.timeStamp ? props.timeStamp : ''
            this.type = props.type ? props.type : "system"
            
    }
    //checks if document exists
   
    //checks if user exists ,returns iD
   }

   

    create() {
        console.log(this);
        // might query using username instead ?
        const createQuery = 'INSERT INTO notifications (uuid, user_id, document_id, type, created_at) VALUES (UUID(), ?, ?, ?, ?)'
       
        return new Promise((resolve, reject) => {
            // notifications has to have userid, docid and a type of notification
            if( !this.targetUser || !this.documentId || !this.type) {
                return reject({message:"Missing userID and docID"})
            }

            sqlSelect(fetchUserQuery, [this.targetUser], (err, success) => {
                    if (err) {
                        console.log(err)
                        return reject({ message: 'No such user' })
                    }
                    if (success) {
                        let uuid = success[0].uuid
                        sqlInsert(createQuery, [uuid, this.documentId, this.type,this.timeStamp], (err, result) => {
                            if (err) {
                                console.log(err)
                                return resolve({ params: [this.targetUser, this.documentId, ,this.type, this.timeStamp], error: err })
                            }
                            return resolve({ message: 'comment uploaded', data: result })
                        })
                    }
                })

     
        })
    }

    load() {
        let that = this
        const fetchNotificationQuery = 'SELECT user_id, type, created_at, document_id FROM notifications WHERE user_id = ?'
        
        return new Promise((resolve, reject) => {
            sqlSelect(fetchUserQuery, [this.targetUser], (err, success) => {
                if (err) {
                    console.log(err)
                    return reject({ message: 'No such user' })
                }

                if (success) {
                    let uuid = success[0].uuid
                    sqlSelect(fetchNotificationQuery, [uuid], (err, result) => {
                        if(err) {
                            return reject({message:"fail to fetch notifications"})
                        }
                        if(result){
                            console.log(result)
                            return resolve({notifications:result})
                        }
                    })
                }
            })
        })
    }

    //Makes comments into a ready display form
}

module.exports = Notifications
