const { sqlInsert, sqlSelect, sqlUpdate } = require('../db')
const _ = require('lodash')

const CREATE_DOC_SQL = 'INSERT INTO documents (uuid, created_at, title, user_id, version) VALUES (UUID(), NOW(), ?, ?, ?)'
const FIND_RECENT_BY_USERID = 'SELECT uuid, title, created_at FROM documents where user_id = ?'
//const FIND_RECENT_BY_USERID_DOCID = 'SELECT uuid, user_id, title, created_at, comments, blocks FROM documents where user_id = ? AND uuid = ? AND version = 1'
//const FIND_FILEPATH = 'SELECT filepath, filename from documents where uuid = ?'
const FIND_FILEPATH_BY_DOCID = 'SELECT filepath, filename from documents where uuid = ?'

const UPDATE_FILEPATH = 'UPDATE documents SET filepath = ?, filename = ? WHERE uuid = ?'
const UPDATE_TITLE_BY_DOC_ID = 'UPDATE documents set title = ? WHERE uuid = ?'
const FIND_SHARED_TO_USEREMAIL = 'SELECT d.uuid, s.owner_id, s.user_email, d.title, d.created_at FROM shared_files s JOIN documents d ON s.document_id = d.uuid WHERE s.user_email = ?'
const CHECK_USER_PERMISSION_ON_DOC = 'SELECT user_id from documents where uuid = ?'

/*This will be visible to public*/
const ParseDocSQL = (rows) => {
    return _.map(rows, function (entries) {
        return {
            title: entries.title,
            docId: entries.uuid,
            filename: entries.filename,
            filepath: entries.filepath,
            userEmail: entries.user_email,
        }
    })
}

class Document {
    constructor(props) {
        if (props) {
            this.doc_id = props.uuid
            this.title = props.title ? props.title : 'untitled'
            this.user_id = props.user_id
            this.version = props.version
            this.filepath = props.filepath ? props.filepath : ''
            this.filename = props.filename ? props.filename : ''
        }
    }

    // DocPublicJson() {
    //     return {
    //         title    : this.title,
    //         doc_id   : this.doc_id,
    //         filename : this.filename,
    //         filepath : this.filepath,
    //     }
    // }


    SQLValueArray() {
        return [this.title, this.user_id, this.filename, this.filepath, this.version]
    }

    save() {
        return new Promise((resolve, reject) => {

            sqlInsert(CREATE_DOC_SQL, this.SQLValueArray(), (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result/** || result**/) { // Check valid result ... ?
                    return reject(new Error('Unknown Error'))
                }
                return resolve(this)
            })
        })
    }

    static create(props) {

        return new Promise((resolve, reject) => {
            const doc = new Document()
            doc.title = props.title
            doc.version = props.version
            doc.user_id = props.user_id
            doc.save().then((savedDoc) => {
                resolve(savedDoc)
            }).catch((error) => {
                console.error(`[Doc][Error] Failed to create Document: ${error.message}`)
                reject(new Error('Internal Server Error'))
            })
        })
    }


    static LoadDocumentsByUserId(user_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_RECENT_BY_USERID, [user_id], (err, documents) => {
                if (err) { console.error(err); return resolve(null) }

                let userFiles = { 'files': ParseDocSQL(documents) }
                resolve(userFiles)
            })
        })
    }

    static LoadSharedDocumentsByUserEmail(user_email) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_SHARED_TO_USEREMAIL, [user_email], (err, documents) => {
                if (err) { console.error(err); return resolve(null) }

                let userFiles = { 'files': ParseDocSQL(documents) }
                resolve(userFiles)
            })
        })
    }


    static UpdateTitleByDocid(doc_id) {
        return new Promise((resolve, reject) => {
            sqlUpdate(UPDATE_TITLE_BY_DOC_ID, [doc_id], (err, res) => {
                if (err) { console.error(err); return resolve(null) }
                resolve(res)
            })
        })
    }

    static FindFilepathByDocid(doc_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_FILEPATH_BY_DOCID, [doc_id], (err, documents) => {
                if (err) {
                    console.error(err)
                    return resolve(null)
                }
                let full_path = documents[0].filepath + documents[0].filename
                resolve(full_path)
            })
        })
    }

    /*Should only be called when first creating pdf*/
    static UpdateDocumentFilepath(doc_id, filepath, filename) {
        return new Promise((resolve, reject) => {
            sqlUpdate(UPDATE_FILEPATH, [doc_id, filepath, filename], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result/** || result**/) { // Check valid result ... ?
                    return reject(new Error('Unknown Error'))
                }
                return resolve(this)
            })
        })
    }

    //validate user permitted to save
    static VaildateDocumentPermission(doc_id, user_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(CHECK_USER_PERMISSION_ON_DOC, [doc_id], (err, result) => {
                if (err) { console.error(err); return reject(err) }
                if (result[0].user_id != user_id) {
                    return resolve(false)
                }
                else {
                    return resolve(true)
                }
            })
        })
    }


    static shareFile(ownerId, doc_id, emails) {
        const shareQuery = ' INSERT INTO shared_files ( owner_id, user_email, document_id) VALUES ( ?, ?, ?)'
        let queries = []
        emails.forEach((email) => {
            queries.push(
                new Promise((resolve, reject) => {
                    sqlInsert(shareQuery, [ownerId, email, doc_id], (err, result) => {
                        if (err) {
                            return reject(new Error('Database Error'))
                        }
                        if (!result/** || result**/) { // Check valid result ... ?
                            return reject(new Error('Unknown Error'))
                        }
                        return resolve({ docId: doc_id, sent_email: email })
                    })

                })
            )
        })
        return Promise.all(queries)
    }

}


module.exports = { Document }
