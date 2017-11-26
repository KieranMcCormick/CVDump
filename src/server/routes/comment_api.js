const express = require('express')
const router = express.Router()
const Comments = require('../models/comments')
const requireLogin = require('../middlewares/requireLogin')

router.use(requireLogin)

router.get('/:docId', (req, res) => {
    const docId = req.params.docId
    Comments.loadComments(docId).then((result, err) => {
        if (err) {
            res.send({ message: 'cant find comments' })
        }
        if (result) {
            res.send(result)
        }
    })
        .catch((exception) => {
            console.log(exception)
            res.send({ message: 'something went wrong fetching comments' })
        })
})

router.post('/create', (req, res) => {
    //let newComment = {data: this.state.newInput , date:this.getCurrentTime() , author: that.state.currentUser.username ,docId:that.state.currentDoc}
    if (validateJson(req.body)) {
        let newComment = new Comments({
            username: req.body.username,
            userId: req.user.uuid,
            documentId: req.body.docId,
            content: req.body.content,
            timeStamp: req.body.createdAt,
        })
        newComment.validateDocument().then((result, err) => {
            if (err) {
                res.send({ message: 'there is no such document' })
            }
            else {
                newComment.create().then((err, result) => {
                    if (err) {
                        res.send(err)
                    }
                    console.log('created comments')
                    res.send({ createdAt: 'comment created', data: result })
                })
            }
        })
            .catch((exception) => {
                res.send({ error: exception })
            })

    } else {
        res.send({ message: 'Not valid comment' })
    }
})

function validateJson(reqData) {
    if (!reqData.content || !reqData.username || !reqData.docId) {
        return false
    } else {
        return true
    }

}
module.exports = router
