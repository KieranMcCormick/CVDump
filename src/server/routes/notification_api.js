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
    
   if(!req.body.targetUser || !req.body.type || !req.body.documentId ) {
       res.send({message:"Missing user and document ID"})
   }

   new Notifications ({
        targetUser: req.body.targetUser,
        documentId: req.body.documentId,
        timeStamp : new Date().toISOString().slice(0, 19).replace('T', ' '),
        type: req.body.type,
    })
    .create().then((result,err) => {

        if(result){
            console.log(result)
            res.send({message:"notification created"})
        }

        if(err) {
            console.log(err)
            res.send({message:"fail to notify user"})
        }

    })
   
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
