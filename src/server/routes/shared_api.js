const express = require('express')
const router = express.Router()
const { Document } = require('../models/document')
const { User } = require('../models/user')
const requireLogin = require('../middlewares/requireLogin')


router.use(requireLogin)

// `owner_id` varchar(36) DEFAULT NULL,
//`user_email` varchar(30) DEFAULT NULL,
//`document_id` varchar(36) DEFAULT NULL,
router.get('/', (req, res) => {
    const user_email = req.user.email_address

    Document.LoadSharedDocumentsByUserEmail(user_email).then((result, err) => {
        if (err) {
            console.error(err)
            res.send({ message: 'Something went wrong loading shared files' })
        }
        else {
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message: 'Something went wrong loading shared files' })
    })

})

//post request has ownerId, document Id and user_email , which can be an array
//share with another user with given email

/*
{
    docId: 1,
    shareWith: ["test2@email.com","test3@email.com"]
}
*/
router.post('/share', (req, res) => {

    if (!req.body.shareWith) {
        //if theres no specified user to share with, or it is empty
        res.send({ message: 'There is no one to share with' })
        // Check if target exists
    } else {
        validateUsers(req.body.shareWith).then((success, error) => {
            if (error) {
                res.send({ message: 'There is no one to share with' })
            }
            if (success) {
                success.forEach((check, index) => {
                    if (check == null) {
                        console.log('no such email ' + req.body.shareWith[index])
                        res.send({ message: 'no such email ' + req.body.shareWith[index] })
                    }
                })
                //create share_objects

                Document.shareFile(req.user.uuid,req.body.docId,req.body.shareWith).then((success, err) => {
                    if (err) {
                        res.send({ message: 'THe user does not exists' })
                    }
                    if (success) {
                        res.send(success)
                    }
                })

            }

        })


    }



})

function validateUsers(emailArray) {
    let validateTasks = []
    emailArray.forEach((email) => {
        validateTasks.push(User.findOneByEmail(email))
    })

    return Promise.all(validateTasks)
}

module.exports = router
