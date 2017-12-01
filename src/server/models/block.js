const { sqlInsert, sqlSelect } = require('../db')
const _ = require('lodash')

const CREATE_BLOCK_SQL = 'INSERT INTO document_blocks (document_id, block_id, block_order) VALUES (?, ?, ?)'
const GET_BLOCKS_BY_USERID = 'SELECT uuid, label, summary, created_at FROM blocks b where user_id = ?'


/*This will be visible to public*/
const ParseBlockSQL = (rows) => {
    return _.map(rows, function (entries) {
        return {
            blockId : entries.uuid,
            summary  : entries.summary,
        }
    })
}

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
            label      : this.label,
            type       : this.type,
            block_id   : this.uuid,
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

    static LoadBlocksByUserId(user_id){
        return new Promise((resolve, reject) => {
            sqlSelect(GET_BLOCKS_BY_USERID, [ user_id ], (err, blocks) => {
                if (err) { console.error(err); return reject(null) }
                resolve(ParseBlockSQL(blocks))
            })
        })
    }

}


module.exports = { Block }
