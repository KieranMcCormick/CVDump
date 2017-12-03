const express = require('express')
const router  = express.Router()
const { Document } = require('../models/document')
const requireLogin = require('../middlewares/requireLogin')


router.use(requireLogin)


router.get('/', (req, res) => {
    const user_email = req.user.email_address

    Document.LoadSharedDocumentsByUserEmail(user_email).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong loading shared files' })
        }
        else{
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message : 'Something went wrong loading shared files' })
    })

})


module.exports = router
