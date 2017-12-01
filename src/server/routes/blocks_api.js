const express = require('express')
const router = express.Router()
const { Block } = require('../models/block')
const requireLogin = require('../middlewares/requireLogin')

router.use(requireLogin)

router.get('/', (req, res) => {

    const user_id = req.user.uuid

    Block.LoadBlocksByUserId(user_id).then((result, err) => {
        if (err) {
            console.error(err)
            res.send({ message: 'Something went wrong loading blocks' })
        }
        else {
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message: 'Something went wrong loading blocks' })
    })


})

router.post('/create', (req, res) => {
    let newBlock = new Block({
        user_id: req.user.uuid,
    })
    console.log(newBlock)
    newBlock.create().then((err, newBlock) => {
        if (err) {
            res.send(err)
        }
        console.log('created block')
        res.send(newBlock)
    })
})

module.exports = router
