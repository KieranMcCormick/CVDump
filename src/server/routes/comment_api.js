const express = require('express')
const router = express.Router()
const Comments = require('../models/comments')

router.get('/', (req, res) => {
    new Comments({ documentId: req.params.docId }).loadComments().then((result, err) => {
        if (err) {
            res.send({ message: 'cant find comments' })
        }
        if (result) {
            res.send({ comments: result })
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
            username: req.body.user_id,
            documentId: req.body.docId,
            content: req.body.content,
            timeStamp: req.body.timeStamp,
        })
        newComment.validateDocument().then((result, err) => {
            if (err) {
                res.send({ message: 'there is no such document' })
            } else {
                newComment.create().then((err, result) => {
                    if (err) {
                        res.send(err)
                    }
                    res.send({ message: 'comment created', data: result })
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
    if (!reqData) {
        return false
    }
    if (!reqData.content || !reqData.user_id || !reqData.docId) {
        return false
    } else {
        return true
    }

}
module.exports = router
