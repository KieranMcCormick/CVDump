const express = require('express')
const router = express.Router()
const Notifications= require('../models/notifications')

router.get('/load', (req, res) => {
    if(validateJson(req.params) ) {
        res.send({message:"Missing user and document ID"})
    }
    new Notifications({
        email:req.params.email
    })
    console.log(req.params.email)
   
})

router.post('/create', (req, res) => {
    
   if(!validateJson(req.body) ) {
       res.send({message:"Missing user and document ID"})
   }

   new Notifications ({
        email: req.body.email,
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
    if(!reqData.email || !reqData.type || !reqData.documentId ) {
        return false
       
    } else {
        return true
    }
}
module.exports = router
