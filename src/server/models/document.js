//credits: refactored from @jonathan users.js
const { sqlInsert, sqlSelect } = require('../db')

const CREATE_DOC_SQL = 'INSERT INTO documents (uuid, created_at, title, user_id, version) VALUES (UUID(), NOW(), ?, ?, ?)'
const FIND_RECENT_BY_USERID = 'SELECT uuid, user_id, title, created_at FROM documents where user_id = ? AND version = 1'
//const FIND_FILEPATH = 'SELECT filepath, filename from documents where uuid = ?'
//const FIND_DOCUMENT_BLOCKS = 'SELECT block_id FROM document_blocks dbs JOIN documents d ON d.uuid = dbs.document_id '

class Document {
    constructor(props) {
        if (props) {
            this.doc_id  = props.uuid
            this.title   = props.title ? props.title : 'untitled'
            this.user_id = props.user_id
            //TODO change to non default val
            this.version = 1
        }
    }

    docJson() {
        return {
            title  : this.title,
            doc_id : this.doc_id,
            user_id: this.user_id,
            version: this.version
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

    static findDocumentsByUserid(user_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_RECENT_BY_USERID, [ user_id ], (err, documents) => {
                if (err) { console.error(err); return resolve(null) }
                //return all documents -> add paging
                var userFiles = {}
                for ( doc in documents ){
                  userFiles['doc'] = new Documents
                }
                resolve(userFiles)
            })
        })
    }

}
