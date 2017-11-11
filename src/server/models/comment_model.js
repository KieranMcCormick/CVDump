var express = require('express')
const db = require('../db.js')
var router = express.Router();


router.get('/get/:documentId',(req,res) =>{
    console.log("fetch comments");
    console.log(req.params.documentId);
    res.send({message:"okay"});
    return;
})

router.post('/create',(req,res) =>{
    console.log("create comment")
    res.send({comments:"okay"});
    return
})
module.exports = router