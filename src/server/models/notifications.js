const { sqlInsert, sqlSelect } = require('../db')
const _ = require('lodash')

class Notifications {
    constructor(props) {
        if (props) {
            this.targetUser = props.targetUser ? props.targetUser : null
            this.documentId = props.documentId ? props.documentId : null
            this.timeStamp = props.timeStamp ? new Date(props.timeStamp).toUTCString() : ''
            this.type = props.content ? props.type : "system"
    }
    //checks if document exists
   
    //checks if user exists ,returns iD
   }
    create() {
        const createQuery = 'INSERT INTO notifications (uuid, user_id, document_id, type, created_at) VALUES (UUID(), ?, ?, ?, ?)'
        return new Promise((resolve, reject) => {
            // notifications has to have userid, docid and a type of notification
            if( !this.targetUser || !this.documentId || !this.type) {
                return reject({message:"Missing userID and docID"})
            }

            sqlInsert(createQuery, [this.username, this.documentId, this.type, this.timeStamp], (err, result) => {
                if (err) {
                    console.log(err)
                    return resolve({ params: [this.username, this.c, this.timeStamp], error: err })
                }
                return resolve({ message: 'comment uploaded', data: result })
            })
        })
    }

    load() {
        let that = this
        const fetchQuery = 'SELECT user_id, type, created_at, document_id FROM notifications WHERE user_id = ?'
        return new Promise((resolve, reject) => {
            sqlSelect(fetchQuery, [this.targetUser], (err, success) => {
                if (err) {
                    console.log(err)
                    return resolve({ message: 'No comments' })
                }
                if (success) {
                    return resolve(that.parseCommentOutput(success))
                }
            })
        })
    }

    //Makes comments into a ready display form
}

module.exports = Notifications
