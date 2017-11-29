const { sqlInsert, sqlSelect } = require('../db')
const _ = require('lodash')

const CREATE_BLOCK_SQL = 'INSERT INTO blocks (uuid, user_id, type, summary) VALUES (UUID(), ?, ?, ?)'

const GET_BLOCKS_SQL = 'SELECT * FROM blocks WHERE user_id = ?'

const EDIT_BLOCK_SQL = 'UPDATE blocks SET summary=? WHERE uuid=?'

const parseBlockOutput = (rows) => {
    let reader = new FileReader()
    return _.map(rows, function (blocks) {
        return {
            label: blocks.username ? blocks.username : 'test',
            type: blocks.type ? blocks.type : 'test',
            summary: blocks.summary ? blocks.summary : 'test',
            uuid: blocks.uuid ? blocks.uuid : 'test',
        }
    })
}

class Block {
    constructor(props) {
        if (props) {
            this.label = props.label ? props.label : 'untitled'
            this.type = props.type ? props.type : 'skills'
            this.user_id = props.user_id
            this.summary = props.summary ? props.summary : ''
        }
    }

    SQLValueArray() {
        return [this.user_id, this.type, this.summary]
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
                console.log('this:')
                console.log(this)
                return resolve(this)
            })
        })
    }

    create(userId) {
        return new Promise((resolve, reject) => {
            //const block = new Block()
            //block.user_id = userId
            this.save().then((savedblock) => {
                resolve(savedblock)
            }).catch((error) => {
                console.error(`[block][Error] Failed to create Block: ${error.message}`)
                reject(new Error('Internal Server Error'))
            })
        })
    }

    static edit(props) {
        return new Promise((resolve, reject) => {
            // validate user first
            sqlInsert(EDIT_BLOCK_SQL, [props.summary, props.uuid], (err, result) => {
                if (err) {
                    console.log(err)
                    return resolve({ params: [this.username, this.content, this.timeStamp], error: err })
                }
                return resolve({ message: 'block edited', data: result })
            })
        })
    }

    static LoadBlocksByUserId(userId) {
        console.log('LoadBlocksByUserId')
        return new Promise((resolve, reject) => {
            sqlSelect(GET_BLOCKS_SQL, [userId], (err, blocks) => {
                if (err) {
                    console.log(err)
                    return resolve({ message: 'No blocks' })
                }
                else {
                    return resolve(blocks)
                }
            })
        })
    }

}

module.exports = Block
