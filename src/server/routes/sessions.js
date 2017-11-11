const express = require('express')
const router = express.Router()
const passport = require('passport')
const _ = require('lodash')
const { validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const {User, UserCreationValidation} = require('../models/user')

router.get('/currentUser', (req, res) => {
    if (req.user) {
        res.json(req.user.publicJson())
    } else {
        res.sendStatus(403)
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err) }
        else if (!user) { return res.status(401).json(info) }
        else {
            req.login(user, (err) => {
                if (err) { return next(err) }
                else {
                    res.json(user.publicJson())
                }
            })
        }
    })(req, res, next)
})

router.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

router.post('/register', UserCreationValidation, (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({ errorMessage:  _.map(errors.mapped(), (value, key) => `${_.upperFirst(key)} ${value.msg}`).join('. ') })
    }

    User.create(matchedData(req)).then((user) => {
        res.json(user.publicJson())
    }).catch((err) => {
        console.error(err)
        res.status(400).json({ errorMessage: err.message })
    })
})

module.exports = router
