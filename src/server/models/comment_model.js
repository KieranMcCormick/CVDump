const express = require('express')
//const db = require('../db.js')
const router = express.Router()
//const bodyParser  = require('body-parser')

router.get('/get/:documentId',(req,res) => {
    console.log('fetch comments')
    console.log(req.params.documentId)
    res.send({message:'okay'})
    return
})

router.post('/create',(req,res) =>{
    console.log('create comment')
    console.log(req.body)
    res.send({comments:'okay'})
    return
})

module.exports = router
