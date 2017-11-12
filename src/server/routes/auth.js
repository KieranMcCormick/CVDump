const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/auth/cas', (req, res, next) => {
    passport.authenticate('cas', {
        failureRedirect: '/login',
    }, (err, user/**, info**/) => {
        if (err) {
            return next(err)
        } else if (!user) {
            return res.redirect('/login')
        } else {
            req.login(user, (err) => {
                if (err) {
                    return next(err)
                } else {
                    res.redirect('/')
                }
            })
        }
    })(req, res, next)
})

router.get('/auth/linkedin', passport.authenticate('linkedin', {
    failureRedirect: '/login',
}))

router.get('/auth/linkedin/callback', (req, res, next) => {
    passport.authenticate('linkedin', {
        failureRedirect: '/login',
    }, (err, user/**, info**/) => {
        if (err) {
            return next(err)
        } else if (!user) {
            return res.redirect('/login')
        } else {
            req.login(user, (err) => {
                if (err) {
                    return next(err)
                } else {
                    res.redirect('/')
                }
            })
        }
    })(req, res, next)
})

module.exports = router
