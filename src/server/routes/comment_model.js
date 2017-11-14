const express = require('express')
const router = express.Router()
const Comments = require('../models/comments')

router.get('/',(req,res) => {
    console.log('fetch comments')
    var documentComments = new Comments({documentId:req.params.docId})
    documentComments.loadComments().then((result,err) =>{
        if(err){
            res.send({message:"cant find comments"})
            return
        }
        if(result) {
            res.send({comments:result})
            return
        }

    })
    .catch( (exception) =>{
        console.log(exception)
        res.send({message:"something went wrong fetching comments"})
        return
    })
   // res.send({message:'okay'})
    return
})

router.post('/create',(req,res) =>{
    //let newComment = {data: this.state.newInput , date:this.getCurrentTime() , author: that.state.currentUser.username ,docId:that.state.currentDoc}
    if (validateJson(req.body)) {
        let newComment = new Comments({
            username: req.body.user_id,
            documentId: req.body.docId,
            content: req.body.content,
            timeStamp: req.body.timeStamp,
        }) 
        newComment.validateDocument().then((result,err)=>{
        
            if(err){
                res.send({message:"there is no such document"})
                return
            } else {
                console.log("document is valid")
                let result = newComment.create().then((err,result) =>{
                    if(err) {
                        res.send(err)
                        return
                    }
                    res.send({message:"comment created"})
                    return
                })
            }
        })
        .catch((exception)=>{s
            console.log(exception)
            res.send({error:exception})
            return  
        })
      
      
    } else {
        res.send({message:"Not valid comment"})
        return
    }
   
   
    return
})

function validateJson(reqData){
    console.log(reqData)
    if(!reqData){
        return false;
    }
    if (!reqData.data || !reqData.author ||!reqData.docId) {
        return false
    } else {
        return true;
    }

}
module.exports = router
