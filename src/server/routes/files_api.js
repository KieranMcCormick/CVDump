const express = require('express')
const router  = express.Router()
const { Document } = require('../models/document')
const { DocumentBlock } = require('../models/documentblock')
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
// router.get('/:id', (req, res) => {
//     const user_id = req.user.uuid
//     DocumentBlock.GetBlocks(id).then((result, err) => {
//         if (err){
//             console.error(err)
//             res.send({ message : 'Something went wrong loading files' })
//         } else {
//             res.send(result)
//         }
//     }).catch((exception) => {
//         console.error(exception)
//         res.send({ message : 'Something went wrong loading files' })
//     })
// })

router.get('/:id', (req, res) => {
    const user_id = req.user.uuid
    const doc_id  = req.params.id
    Document.VaildateDocumentPermission(doc_id, user_id).then((res, err) => {
        if( err ){
            throw(err)
        }
        else{
            if ( res ){
                return DocumentBlock.GetDocumentBlocks(doc_id)
            }
            else{
                res.status(403).send({ message : 'User does not have permission to view' })
                throw(err)
            }
        }
    }).then((result, err) => {
        if (err){
            console.error(err)
            res.status(403).send({ message : 'Something went wrong loading files' })
        } else {
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        if ( !res.headersSent ){
            res.status(500).send({ message : 'Something went wrong loading files' })
        }
    })
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


router.post('/create', (req, res) => {
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

router.get('/pdf/:id', function(req, res){

    const doc_id  = req.params.id
    const user_id = req.user.uuid

    Document.VaildateDocumentPermission(doc_id, user_id).then((result, err) => {
        if (err){
            throw(err)
        }
        else if (result){
            return accessFS.retrievePDF(doc_id)
        }
    }).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong loading the pdf' })
        }
        else{
            res.type('pdf')
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message : 'Something went wrong loading the pdf' })
    })
})

router.post('/savepdf/:id', (req, res) => {

    const user_id = req.user.uuid
    const doc_id = req.params.id

    Document.VaildateDocumentPermission(doc_id, user_id).then((result, err) => {
        if (err){
            throw(err)
        }
        else if (result){
            const blocks = req.params.blocks
            const title = req.params.title

            return DocumentBlock.UpdateDocument(doc_id, blocks, title)
        }
    }).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong saving the pdf' })
        }
        else{
            return accessFS.generatePDF(user_id)
        }

    }).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong saving the pdf' })
        }
        else{
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception.error_message)
        res.send({ message : 'Something went wrong saving the pdf' })
    })

})

module.exports = router
