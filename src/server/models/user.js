const bcrypt = require('bcrypt')
const crypto = require('crypto')

const { check } = require('express-validator/check')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const { cqlInsert, cqlSelect } = require('../db')
const config = require('../config')
const keys = require('../config/keys')

const BCRYPT_HASHING_ROUNDS = 10

const FIND_USER_BY_EMAIL_CQL       = 'SELECT username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM project.users WHERE email_address = ? LIMIT 1'
const FIND_USER_BY_USERNAME_CQL    = 'SELECT username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM project.users WHERE username = ? LIMIT 1'
const FIND_USER_BY_CAS_ID_CQL      = 'SELECT username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM project.users WHERE cas_id = ? LIMIT 1 ALLOW FILTERING'
const FIND_USER_BY_LINKEDIN_ID_CQL = 'SELECT username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM project.users WHERE linked_in = ? LIMIT 1 ALLOW FILTERING'
const UPSERT_USER_CQL              = 'UPDATE project.users SET password = ?, email_address = ?, firstname = ?, lastname = ?, cas_id = ?, linkedin_id = ? WHERE username = ?'
const UPDATE_PROFILE_CQL           = 'UPDATE project.users SET email_address = ?, firstname = ?, lastname = ? WHERE username = ?'
const UPDATE_CAS_ID_CQL            = 'UPDATE project.users SET cas_id = ? WHERE username = ?'
const UPDATE_LINKEDIN_IN_CQL       = 'UPDATE project.users SET linkedin_id = ? WHERE username = ?'
const UPDATE_PASSWORD_CQL          = 'UPDATE project.users SET password = ? WHERE username = ?'

const UserUpdatePasswordValidation = [
    check('password', 'must contain at least one lowercase, uppercase, number, and symbol')
        .matches(/[a-z]/).matches(/[A-Z]/).matches(/\d/).matches(/\W/)
        .isLength({min: 8}).withMessage('must be at least 8 characters long'),
    check('confirmPassword', 'must be present and match Password') // Can't seem to match against other param with express-validator
]

const UserUpdateProfileValidation = [
    check('email').isEmail().withMessage('must be a valid Email').trim() //.normalizeEmail()
        .custom(value => { return User.findOneByEmail(value).then((user) => {
            if (user) { throw new Error('must be a valid Email') }
            return true
        })})
]

const UserCreationValidation = _.concat(UserUpdateProfileValidation, UserUpdatePasswordValidation, [
    check('username').matches(/^[a-z\d\-_]+$/i).withMessage('can only contain alphanumerics, -, and _')
        .isLength({min: 3}).withMessage('must be at least 3 characters long')
        .custom(value => { return User.findOneByUsername(value).then((user) => {
            if (user) { throw new Error('must be a unique username') }
            return true
        })})
])

class User {
    constructor(props) {
        if (props) {
            this.username = props.username
            this.password = props.password
            this.email_address = props.email_address
            this.cas_id = props.cas_id
            this.linkedin_id = props.linkedin_id
            this.firstname = props.firstname
            this.lastname = props.lastname
        }
    }

    publicJson() {
        return {
            username: this.username,
            email: this.email_address,
            firstname: this.firstname,
            lastname: this.lastname,
            avatar_url: this.avatarURL(),
        }
    }

    generateJWT() {
        return jwt.sign({ user: this.publicJson() }, keys.jwtSecret, {
            expiresIn: 60*24,
            issuer: config.server.fqdn,
            audience: config.server.fqdn,
        })
    }

    avatarURL(size=256, fallback='identicon') {
        const hash = crypto.createHash('md5').update(this.email_address).digest('hex')
        return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${fallback}&r=g`
    }

    // Not strictly necessary unless we want differing field names in UI.
    static mapFrontEndFieldsToDB(props) {
        props.email_address = props.email
        delete props.email
        return props
    }

    serialize() {
        return {
            username: this.username,
            password: this.password,
            email_address: this.email_address,
            cas_id: this.cas_id,
            linkedin_id: this.linkedin_id,
            firstname: this.firstname,
            lastname: this.lastname,
        }
    }

    setPassword(password) {
        return bcrypt.hash(password, BCRYPT_HASHING_ROUNDS).then((hash) => {
            if (hash) {
                this.password = hash
                return true
            } else {
                return false
            }
        }).catch((error) => {
            console.error(`Failed to hash a password: ${error}`)
            return false
        })
    }

    // This is used for CQL so DO NOT CHANGE THE ORDER without
    // changing the prepared query UPSERT_USER_CQL.
    // username is the primary key and hence used in the WHERE clause
    cqlValueArray() {
        return [ this.password, this.email_address, this.firstname, this.lastname, this.cas_id, this.linkedin_id, this.username ]
    }

    save() {
        return new Promise((resolve, reject) => {
            cqlInsert(UPSERT_USER_CQL, this.cqlValueArray(), (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result/** || result**/) { // Check valid result ... ?
                    return reject(new Error('Unknown Error'))
                }
                return resolve(this)
            })
        })
    }

    updatePassword(props) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(props.currentPassword, this.password).catch((err) => {
                console.error(err)
                return reject(new Error('Internal Server Error'))
            }).then((result) => {
                if (!result) {
                    return reject(new Error('Incorrect Current Password'))
                }
                if (props.confirmPassword !== props.password) {
                    return reject(new Error('Passwords do not match'))
                }
                this.setPassword(props.password).then((success) => {
                    if (success) {
                        cqlInsert(UPDATE_PASSWORD_CQL, [ this.password, this.username ], (err, result) => {
                            if (err) {
                                console.error(err)
                                return reject(new Error('Database Error'))
                            }
                            if (!result/** || result**/) { // Check valid result ... ?
                                return reject(new Error('Unknown Error'))
                            }
                            return resolve(this)
                        })
                    } else {
                        reject(new Error('Internal Server Error'))
                    }
                })
            })
        })
    }

    updateCASID(cas_id) {
        return new Promise((resolve, reject) => {
            cqlInsert(UPDATE_CAS_ID_CQL, [ cas_id, this.username ], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result/** || result**/) { // Check valid result ... ?
                    return reject(new Error('Unknown Error'))
                }
                this.cas_id = cas_id
                return resolve(this)
            })
        })
    }

    updateLinkedinID(linkedin_id) {
        return new Promise((resolve, reject) => {
            cqlInsert(UPDATE_LINKEDIN_IN_CQL, [ linkedin_id, this.username ], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result/** || result**/) { // Check valid result ... ?
                    return reject(new Error('Unknown Error'))
                }
                this.linkedin_id = linkedin_id
                return resolve(this)
            })
        })
    }

    updateProfile(props) {
        props = this.mapFrontEndFieldsToDB(props)
        return new Promise((resolve, reject) => {
            cqlInsert(UPDATE_PROFILE_CQL, [ props.email_address, props.firstname, props.lastname, this.username ], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result/** || result**/) { // Check valid result ... ?
                    return reject(new Error('Unknown Error'))
                }
                this.email_address = props.email_address
                this.firstname = props.firstname
                this.lastname = props.lastname
                return resolve(this)
            })
        })
    }

    static findOneByEmail(email_address) {
        return new Promise((resolve, reject) => {
            cqlSelect(FIND_USER_BY_EMAIL_CQL, [ email_address ], (err, users) => {
                if (err) { console.error(err); return resolve(null) }
                if (users.length < 1) { return resolve(null) }
                if (users.length > 1) {
                    console.error(`[User] DATABASE INCONSISTENCY! Found more than one user for Email ${email_address}`)
                    return resolve(null)
                }
                resolve(new User(users[0]))
            })
        })
    }

    static findOneByUsername(username) {
        return new Promise((resolve, reject) => {
            cqlSelect(FIND_USER_BY_USERNAME_CQL, [ username ], (err, users) => {
                if (err) { console.error(err); return resolve(null) }
                if (users.length < 1) { return resolve(null) }
                else if (users.length > 1) {
                    console.error(`[User] DATABASE INCONSISTENCY! Found more than one user for Username ${username}`)
                    return resolve(null)
                }
                resolve(new User(users[0]))
            })
        })
    }

    static findOneByCASID(cas_id) {
        return new Promise((resolve, reject) => {
            cqlSelect(FIND_USER_BY_CAS_ID_CQL, [ cas_id ], (err, users) => {
                if (err) { console.error(err); return resolve(null) }
                if (users.length < 1) { return resolve(null) }
                else if (users.length > 1) {
                    console.error(`[User] DATABASE INCONSISTENCY! Found more than one user for CAS ID ${cas_id}`)
                    return resolve(null)
                }
                resolve(new User(users[0]))
            })
        })
    }

    static findOneByLinkedInID(linkedin_id) {
        return new Promise((resolve, reject) => {
            cqlSelect(FIND_USER_BY_LINKEDIN_ID_CQL, [ linkedin_id ], (err, users) => {
                if (err) { console.error(err); return resolve(null) }
                if (users.length < 1) { return resolve(null) }
                else if (users.length > 1) {
                    console.error(`[User] DATABASE INCONSISTENCY! Found more than one user for LinkedIn ID ${linkedin_id}`)
                    return resolve(null)
                }
                resolve(new User(users[0]))
            })
        })
    }

    static passwordLogin(username, password) {
        return new Promise((resolve, reject) => {
            this.findOneByUsername(username).then((user) => {
                if (!user || user.password.trim() === '') {
                    return resolve(null)
                }
                return bcrypt.compare(password, user.password).catch((err) => {
                    console.error(err)
                    resolve(null)
                }).then((result) => {
                    if (result) {
                        return resolve(user)
                    }
                    resolve(null)
                })
            })
        })
    }

    // Assuming parameters has been validated by UserValidation
    static create(props) {
        props = this.mapFrontEndFieldsToDB(props)
        return new Promise((resolve, reject) => {
            if (props.confirmPassword !== props.password) {
                return reject(new Error('Passwords do not match'))
            }
            const user = new User()
            user.username = props.username
            user.email_address = props.email_address
            user.cas_id = props.cas_id
            user.linkedin_id = props.linkedin_id
            user.firstname = props.firstname
            user.lastname = props.lastname
            user.setPassword(props.password).then((passwordSet) => {
                if (passwordSet) {
                    user.save().then((savedUser) => {
                        resolve(savedUser)
                    }).catch((error) => {
                        console.error(`[User][Error] Failed to create User: ${error.message}`)
                        reject(new Error('Internal Server Error'))
                    })
                } else {
                    console.error('[User][Error] Could not create User due to password error')
                    reject(new Error('Internal Server Error'))
                }
            })
        })
    }
}

module.exports = { User, UserCreationValidation, UserUpdatePasswordValidation, UserUpdateProfileValidation }