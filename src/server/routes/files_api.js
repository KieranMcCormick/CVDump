const express = require('express')
const router  = express.Router()
const { Document } = require('../models/document')
const requireLogin = require('../middlewares/requireLogin')

router.use(requireLogin)

/**
 * returns the collection of files base on user session
 */
router.get('/', (req, res) => {
    const user_id = req.user.user_id
    if( user_id ){
        Document.LoadDocumentsByUserId(user_id).then((result, err) => {
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

/**
 * returns file with `id` for the user
 */
router.get('/:id', (req, res) => {
    const user_id = req.user.user_id
    if (user_id) {
        Document.LoadDocumentsByUserId(user_id).then((result, err) => {
            if (err){
                console.error(err)
                res.send({ message : 'Something went wrong loading files' })
            } else {
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
