const { sqlInsert, sqlSelect } = require('../db')
const _ = require('lodash')

const CREATE_DOC_SQL = 'INSERT INTO document_blocks (document_id, block_id, block_order) VALUES (?, ?, ?)'
const GET_BLOCKS_BY_DOCID_SQL = 'SELECT dbs.block_order, b.summary FROM blocks b JOIN document_blocks dbs ON dbs.block_id = b.uuid WHERE dbs.document_id = ? ORDER BY block_order ASC'
//const UPDATE_DOCUMENT_BY_DOCID_SQL = 'UPDATE document_blocks dbs set block_order = ? WHERE document_id = ? AND block_id = ?'

/*This will be visible to public*/
const ParseDocBlockSQL = (rows) => {
    return _.map(rows, function (entries) {
        return {
            blockOrder : entries.block_order,
            summary    : entries.summary,
        }
    })
}

class DocumentBlock {
    constructor(props) {
        if (props) {
            this.block_id    = props.block_id
            this.blockOrder  = props.block_order
            this.summary     = props.summary
            this.document_id = props.document_id
        }
    }

    // blockJson() {
    //     return {
    //         blockOrder  : this.blockOrder,
    //         summary     : this.summary,
    //     }
    // }

    SQLValueArray() {
        return [ this.document_id, this.block_id, this.block_order ]
    }

    save() {
        return new Promise((resolve, reject) => {

            sqlInsert(CREATE_DOC_SQL, this.SQLValueArray(), (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result) {
                    return reject(new Error('Unknown Error'))
                }
                return resolve(this)
            })
        })
    }

    static create(props) {

        return new Promise((resolve, reject) => {
            const block = new DocumentBlock()
            block.uuid  = props.uuid
            block.label = props.label
            block.type  = props.type
            block.user_id = props.user_id
            block.summary = props.summary
            block.updated_at = props.updated_at
            block.created_at = props.created_at
            block.save().then((savedblock) => {
                resolve(savedblock)
            }).catch((error) => {
                console.error(`[block][Error] Failed to create Block: ${error.message}`)
                reject(new Error('Internal Server Error'))
            })
        })
    }


    static GetDocumentBlocks(doc_id){
        return new Promise((resolve, reject) => {
            sqlSelect(GET_BLOCKS_BY_DOCID_SQL, [ doc_id ], (err, blocks) => {
                if (err) { console.error(err); return reject(null) }
                resolve(ParseDocBlockSQL(blocks))
            })
        })
    }

    // static UpdateDocument(doc_id, blocks, title){
    //     return new Promise((resolve, reject) => {
    //         sqlUpdate(UPDATE_DOCUMENT_BY_DOCID_SQL, [ doc_id ], (err, result) => {
    //             if (err) { console.error(err); return reject(null) }
    //             resolve(result)
    //         })
    //     })
    // }

}


module.exports = { DocumentBlock }
