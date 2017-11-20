const express = require('express')
const router  = express.Router()
const { Document } = require('../models/document')


router.get('/userfiles', (req, res) => {
    const user_id = req.user.user_id
    if( user_id ){
        Document.LoadDocumentsByUserid(user_id).then((result, err) => {
            if (err){
                console.error(err)
                res.send({ message : 'Something went wrong loading files' })
            }
            else{
                res.send(result)
            }
        }).catch((exception) => {
            console.error(exception)
            res.send({ message : 'Something went wrong loading files' })
        })
    }
})

// router.get('/savepdf/:doc_id?', (req, res) => {

//     const doc_id = req.params.doc_id

// })

// router.get('/savepdf', function(req, res){

// })

module.exports = router
