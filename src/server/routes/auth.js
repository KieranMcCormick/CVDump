const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/auth/cas', (req, res, next) => {
    passport.authenticate('cas', {
        failureRedirect: '/login',
    }, (err, user, info) => {
        if (err) {
            console.error(err)
            if (process.env.NODE_ENV === 'production') {
                return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent('Internal Server Error')}`)
            } else {
                return next(err)
            }
        } else if (!user) {
            console.log(info)
            return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent(info.errorMessage || 'Unknown Error')}`)
        } else {
            req.login(user, (err) => {
                if (err) {
                    console.error(err)
                    if (process.env.NODE_ENV === 'production') {
                        return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent('Internal Server Error')}`)
                    } else {
                        return next(err)
                    }
                } else {
                    res.cookie('JWT', user.generateJWT(), {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                    })
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
    }, (err, user, info) => {
        if (err) {
            console.error(err)
            if (process.env.NODE_ENV === 'production') {
                return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent('Internal Server Error')}`)
            } else {
                return next(err)
            }
        } else if (!user) {
            return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent(info.errorMessage || 'Unknown Error')}`)
        } else {
            req.login(user, (err) => {
                if (err) {
                    console.error(err)
                    if (process.env.NODE_ENV === 'production') {
                        return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent('Internal Server Error')}`)
                    } else {
                        return next(err)
                    }
                } else {
                    res.cookie('JWT', user.generateJWT(), {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                    })
                    res.redirect('/')
                }
            })
        }
    })(req, res, next)
})

module.exports = router
