const express = require('express')
const router = express.Router()
const Notifications= require('../models/notifications')

router.get('/', (req, res) => {
    new Notifications({ documentId: req.params.docId }).loadComments().then((result, err) => {
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
   
})

router.post('/delete',(req,res) => {

});

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
