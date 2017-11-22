const express = require('express')
const router = express.Router()
const Notifications= require('../models/notifications')

router.get('/load', (req, res) => {
    if(validateJson(req.query) ) {
        res.send({message:"Missing user and document ID"})
    }
    new Notifications({
        email:req.query.email
    })
    .load().then( (result,err) =>{
        if(result){
            res.send({notifications:result})
        }

        if(err){
            res.send({message:"no notifications"})
        }
    })
    .catch((exception) =>{
        res.send({message:"There is no such user"})
    })
   
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
    .catch((exception) =>{
        res.send({message:"There is no such user"})
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
