const express = require('express')
const router  = express.Router()
const fs      = require('../fs')

router.get('/savepdf/:doc_id?', (req, res, next) => {

    const doc_id    = req.params.doc_id
    //const curr_user = idk

    if(doc_id){
        //autheticate user before returning file
        next()
    }
    else{
        next(new Error("No such document"))
    }
})

router.get('/savepdf', function(req, res){

})

module.exports = router