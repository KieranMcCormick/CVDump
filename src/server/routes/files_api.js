const express = require('express')
const router  = express.Router()
const { Document } = require('../models/document')
const requireLogin = require('../middlewares/requireLogin')
const accessFS = require('../fs')

router.use(requireLogin)

/**
 * returns the collection of files base on user session
 */
router.get('/', (req, res) => {
    const user_id = req.user.uuid
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
    else{
        res.send([])
    }
})

/**
 * returns file with `id` for the user
 */
router.get('/:id', (req, res) => {
    const user_id = req.user.uuid
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


router.post('/update/:doc_id', (req, res) => {
    const user_id = req.user.uuid
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


router.get('/create', (req, res) => {
    const user_id = req.user.uuid
    const version = 1
    const title = req.params.title
    if( user_id ){
        Document.create(user_id, version, title).then((result, err) => {
            if (err){
                console.error(err)
                res.send({ message : 'Something went wrong creating files' })
            }
            else{
                res.send(result)
            }
        }).catch((exception) => {
            console.error(exception)
            res.send({ message : 'Something went wrong creating files' })
        })
    }
    else{
        res.send([])
    }
})

// router.get('/pdf/:id', function(req, res){
//     const doc_id = req.params.doc_id
//     if(Document.VaildateDocument(doc_id)){
//         Document.FindFilepathByDocid(doc_id).then((result, err) => {
//             if (err){
//                 console.error(err)
//                 res.send({ message : 'Something went wrong loading files' })
//             }
//             else{
//                 res.send(result)
//             }
//         }).catch((exception) => {
//             console.error(exception)
//             res.send({ message : 'Something went wrong loading files' })
//         })
//     }
// })

router.get('/savepdf/:id?', (req, res) => {
    const doc_id   = req.params.id

    //if(Document.VaildateDocument(doc_id)){
    accessFS.generatePDF(doc_id).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong loading files' })
        }
        else{
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception.error_message)
        res.send({ message : 'Something went wrong loading files' })
    })
    //}
})

module.exports = router
