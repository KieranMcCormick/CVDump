const express = require('express')
const router = express.Router()
const Notifications = require('../models/notifications')

//Called after login? or along with login?
router.get('/load', (req, res) => {
    console.log(req.query)
    new Notifications({ email: req.query.email }).load().then((result, err) => {
        if (result) {
            res.send(result)
        }

        if (err) {
            res.send({ message: 'no notifications' })
        }
    })
        .catch((exception) => {
            console.log(exception)
            res.send({ message: exception })
        })
})

router.post('/create', (req, res) => {
    let newNotification = {
        sender: req.body.sender,
        documentId: req.body.documentId,
        timeStamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        type: req.body.type,
    }

    new Notifications(newNotification).create().then((result, err) => {
        if (err) {
            res.sendStatus(401)

        }

        if (result) {
            res.send(result)
        }
    })
        .catch((exception) => {
            console.log(exception)
            res.send({ message: exception })
        })
})

router.post('/delete', (req, res) => {

    new Notifications().delete(req.body.id).then((result, err) => {
        if (err) {
            res.send({ message: 'cant find comments' })
        }
        if (result) {
            res.sendStatus(200)
        }
    })

})

module.exports = router
