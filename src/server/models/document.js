//credits: refactored from @jonathan users.js
const { sqlInsert, sqlSelect, sqlUpdate } = require('../db')

const CREATE_DOC_SQL = 'INSERT INTO documents (uuid, created_at, title, user_id, version) VALUES (UUID(), NOW(), ?, ?, ?)'
const FIND_RECENT_BY_USERID = 'SELECT uuid, user_id, title, created_at FROM documents where user_id = ?'
//const FIND_RECENT_BY_USERID_DOCID = 'SELECT uuid, user_id, title, created_at, comments, blocks FROM documents where user_id = ? AND uuid = ? AND version = 1'
//const FIND_FILEPATH = 'SELECT filepath, filename from documents where uuid = ?'
const FIND_FILEPATH_BY_DOCID = 'SELECT filepath, filename from documents where uuid = ?'
const UPDATE_FILEPATH = 'UPDATE documents SET filepath = ? WHERE uuid = ?'
const UPDATE_TITLE_BY_DOC_ID = 'UPDATE documents set title = ? WHERE uuid = ?'


class Document {
    constructor(props) {
        if (props) {
            this.doc_id   = props.uuid
            this.title    = props.title ? props.title : 'untitled'
            this.user_id  = props.user_id
            this.version  = props.version
        }
    }

    docJson() {
        return {
            title    : this.title,
            doc_id   : this.doc_id,
            user_id  : this.user_id,
            version  : this.version,
        }
    }

    SQLValueArray() {
        return [ this.title, this.user_id, this.version ]
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
            doc.title   = props.title
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
            sqlSelect(FIND_RECENT_BY_USERID, [ user_id ], (err, documents) => {
                if (err) { console.error(err); return resolve(null) }
                //return all documents -> add paging
                let userFiles = { 'files' : [] }
                for ( let doc of documents ){
                    userFiles.files.push(new Document(doc))
                }
                resolve(userFiles)
            })
        })
    }


    // static LoadDocumentByUserIdAndDocId(user_id, doc_id) {
    //     return new Promise((resolve, reject) => {
    //         sqlSelect(FIND_RECENT_BY_USERID_DOCID, [ user_id, doc_id ], (err, document) => {
    //             if (err) { console.error(err); return resolve(null) }
    //             resolve(new Document(document))
    //         })
    //     })
    // }

    static UpdateTitleByDocid(doc_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(UPDATE_TITLE_BY_DOC_ID, [ doc_id ], (err, res) => {
                if (err) { console.error(err); return resolve(null) }
                resolve(res)
            })
        })
    }

    static FindFilepathByDocid(doc_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_FILEPATH_BY_DOCID, [ doc_id ], (err, documents) => {
                if (err) { console.error(err); return resolve(null) }
                let full_path = documents[0].filepath + documents[0].filename
                resolve(full_path)
            })
        })
    }

    static UpdateDocumentFilepath(doc_id, filepath, filename){
        return new Promise((resolve, reject) => {
            sqlUpdate(UPDATE_FILEPATH, [ doc_id, filepath, filename ], (err, result) => {
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

    //validate not already saved and user permitted to save
    // static VaildateDocument(doc_id){
    // }

}


module.exports = { Document }
