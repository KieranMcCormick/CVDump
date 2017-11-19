const { sqlInsert, sqlSelect } = require('../db')
const _ = require('lodash')

class Comments {
    constructor(props) {
        if (props) {
            this.username = props.username ? props.username : ''
            this.documentId = props.documentId ? props.documentId : ''
            this.timeStamp = props.timeStamp ? new Date(props.timeStamp).toUTCString() : ''
            this.content = props.content ? Buffer(props.content, 'base64') : ''
        }
    }
    //checks if document exists
    validateDocument() {
        const getDocumentQuery = 'SELECT title FROM project.documents WHERE uuid = ? '
        return new Promise((resolve, reject) => {
            sqlSelect(getDocumentQuery, [this.documentId], (err, result) => {
                if (err) {
                    return resolve({ error: err, message: 'No such document' })
                }
                if (result) {
                    console.log(result)
                    return resolve(result[0].title)
                }
            })
        })

    }
    //checks if user exists ,returns iD
    create() {
        const createQuery = 'INSERT INTO project.comments (uuid, user_id, document_id, comment, created_at) VALUES (UUID(), ?, ?, ?, ?)'
        return new Promise((resolve, reject) => {
            // validate user first
            sqlInsert(createQuery, [this.username, this.documentId, this.content, this.timeStamp], (err, result) => {
                if (err) {
                    console.log(err)
                    return resolve({ params: [this.username, this.content, this.timeStamp], error: err })
                }
                return resolve({ message: 'comment uploaded', data: result })
            })
        })
    }

    loadComments() {
        let that = this
        const fetchQuery = 'SELECT user_id, comment, created_at FROM project.comments WHERE document_id = ?'
        return new Promise((resolve, reject) => {
            sqlSelect(fetchQuery, [this.documentId], (err, success) => {
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
    parseCommentOutput(rows) {
        return _.map(rows, function (entries) {
            //convert blob to string
            entries.comment = entries.comment.toString('base64')
            return {
                user_id: entries.user_id,
                content: entries.comment,
                timeStamp: entries.created_at,
            }
        })
    }
}

module.exports = Comments
