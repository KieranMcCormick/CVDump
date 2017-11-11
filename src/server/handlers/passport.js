const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const LinkedInStrategy = require('passport-linkedin').Strategy
const CASStrategy = require('passport-cas').Strategy
const config = require('../config')
const keys = require('../config/keys')

const {User} = require('../models/user')

module.exports = (app) => {
    passport.serializeUser((user, done) => done(null, user.username))
    passport.deserializeUser((id, done) => {
        // findOne is filler until have DB hooked up.
        User.findOneByUsername(id).then((user) => {
            if (!user) {
                return done(null, false, { message: 'User Not Found'})
            }
            done(null, user)
        })
    })
    passport.use('cas', new CASStrategy(
        {
            version: 'CAS3.0',
            ssoBaseURL: 'https://cas.sfu.ca/cas',
            serverBaseURL: `${config.server.fqdn}/auth/cas`,
            validateURL: '/serviceValidate',
        },
        (login, done) => {
            const cas_id = login.user.replace(/@\w*\.?sfu.ca/, '')
            if (cas_id) {
                User.findOneByCASID(cas_id).then((user) => {
                    if (!user) {
                        done(null, false, { errorMessage: 'User Not Found' })
                    } else {
                        done(null, user)
                    }
                })
            } else { // safety
                done(null, false, { errorMessage: 'Invalid Authentication' })
            }
        }
    ))
    passport.use('linkedin', new LinkedInStrategy(
        {
            consumerKey: keys.linkedinKey,
            consumerSecret: keys.linkedinSecret,
            callbackURL: `${config.server.fqdn}/auth/linkedin/callback`,
            profileFields: ['id', 'first-name', 'last-name', 'email-address'],
        },
        (token, tokenSecret, profile, done) => {
            console.log(`Received LinkedIn Auth for ${JSON.stringify(profile)}`)
            if (profile.id) {
                User.findOneByLinkedInID(profile.id).then((user) => {
                    if (!user) {
                        return done(null, false, { errorMessage: 'User Not Found'})
                    }
                    done(null, user)
                })
            } else { // safety
                done(null, false, { errorMessage: 'Invalid Authentication'})
            }
        }
    ))
    passport.use('local', new LocalStrategy(
        (username, password, done) => {
            User.passwordLogin(username, password).then((user) => {
                if (!user) {
                    return done(null, false, { errorMessage: 'Incorrect Username/Password'})
                }

                done(null, user)
            })
        }
    ))

    app.use(passport.initialize())
    app.use(passport.session())
}
