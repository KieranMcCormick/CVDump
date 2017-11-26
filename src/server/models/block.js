const { sqlInsert, sqlSelect } = require('../db')

const CREATE_BLOCK_SQL = 'INSERT INTO document_blocks (document_id, block_id, block_order) VALUES (?, ?, ?)'
const GET_BLOCKS_BY_DOCID_SQL = 'SELECT b.summary FROM blocks b JOIN document_blocks dbs ON dbs.block_id = b.uuid WHERE dbs.document_id = ? ORDER BY block_order ASC'

class Block {
    constructor(props) {
        if (props) {
            this.block_id   = props.uuid
            this.label      = props.label ? props.label : 'untitled'
            this.type       = props.type
            this.user_id    = props.user_id
            this.summary    = props.summary
            this.updated_at = props.updated_at
            this.created_at = props.created_at
        }
    }

    blockJson() {
        return {
            uuid       : this.uuid,
            label      : this.label,
            type       : this.type,
            block_id   : this.block_id,
            user_id    : this.user_id,
            updated_at : this.updated_at,
            summary    : this.summary,
        }
    }

    SQLValueArray() {
        return [ this.document_id, this.block_id, this.block_order ]
    }

    save() {
        return new Promise((resolve, reject) => {

            sqlInsert(CREATE_BLOCK_SQL, this.SQLValueArray(), (err, result) => {
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
            const block = new Block()
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

    //WIP
    static GetBlocks(id){
        return new Promise((resolve, reject) => {
            sqlSelect(GET_BLOCKS_BY_DOCID_SQL, [ id ], (err, blocks) => {
                if (err) { console.error(err); return resolve(null) }
                let doc = ''

                for ( let b of blocks ){
                    doc += b.summary
                }
                console.log(doc)
                resolve(doc)
            }).catch((error) => {
                console.error(`Failed to compile blocks from document ${id}`)
                reject(error)
            })
        })
    }

}


module.exports = { Block }
