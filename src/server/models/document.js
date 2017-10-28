// //credits: refactored from @jonathan users.js
// const { sqlInsert, sqlSelect } = require('../db')

// const CREATE_DOC_SQL = 'INSERT INTO documents (uuid, created_at, title, user_id, version) VALUES (UUID(), NOW(), ?, ?, ?)'
// //temp query


// class Document {
//     constructor(props) {
//         if (props) {
//             this.title = props.title ? props.title : 'untitled'
//             this.username = this.username
//             //TODO this.user_id = props.user_id
//             //TODO change to non default val
//             this.version = 1
//             //TODO this.filepath
//         }
//     }

//     SQLValueArray() {
//         return [ this.title, this.user_id, this.version ]
//     }

//     save() {
//         return new Promise((resolve, reject) => {

//             sqlInsert(CREATE_DOC_SQL, this.SQLValueArray(), (err, result) => {
//                 if (err) {
//                     console.error(err)
//                     return reject(new Error('Database Error'))
//                 }
//                 if (!result/** || result**/) { // Check valid result ... ?
//                     return reject(new Error('Unknown Error'))
//                 }
//                 return resolve(this)
//             })
//         })
//     }


// }
