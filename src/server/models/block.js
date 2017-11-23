const { sqlInsert } = require('../db')

const CREATE_BLOCK_SQL = 'INSERT INTO document_blocks (document_id, block_id, block_order) VALUES (?, ?, ?)'

class Block {
    constructor(props) {
        if (props) {
            this.block_id   = props.uuid
            this.label      = props.label ? props.label : 'untitled'
            this.type       = props.type
            this.user_id    = props.user_id
            this.blob       = props.blob
            this.updated_at = props.updated_at
        }
    }

    blockJson() {
        return {
            label      : this.label,
            type       : this.type,
            block_id   : this.block_id,
            user_id    : this.user_id,
            updated_at : this.updated_at,
            blob       : this.blob,
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
                if (!result/** || result**/) { // Check valid result ... ?
                    return reject(new Error('Unknown Error'))
                }
                return resolve(this)
            })
        })
    }

    static create(props) {

        return new Promise((resolve, reject) => {
            const block = new Block()
            block.title   = props.title
            block.version = props.version
            block.user_id = props.user_id
            block.save().then((savedblock) => {
                resolve(savedblock)
            }).catch((error) => {
                console.error(`[block][Error] Failed to create Block: ${error.message}`)
                reject(new Error('Internal Server Error'))
            })
        })
    }

}


module.exports = { Block }
