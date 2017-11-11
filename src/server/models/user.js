const bcrypt = require('bcrypt')
const crypto = require('crypto')

const { check } = require('express-validator/check')

const { cqlInsert, cqlSelect } = require('../db')

const BCRYPT_HASHING_ROUNDS = 10

const FIND_USER_BY_EMAIL_CQL       = 'SELECT username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM project.users WHERE email_address = ? LIMIT 1'
const FIND_USER_BY_USERNAME_CQL    = 'SELECT username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM project.users WHERE username = ? LIMIT 1'
const FIND_USER_BY_CAS_ID_CQL      = 'SELECT username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM project.users WHERE linkedin_id = ? LIMIT 1'
const FIND_USER_BY_LINKEDIN_ID_CQL = 'SELECT username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM project.users WHERE cas_id = ? LIMIT 1'
const UPSERT_USER_CQL              = 'UPDATE project.users SET password = ?, email_address = ?, firstname = ?, lastname = ?, cas_id = ?, linkedin_id = ? WHERE username = ?'
// const UPDATE_PROFILE_CQL           = 'UPDATE project.users SET email_address = ?, firstname = ?, lastname = ? WHERE username = ?'
// const UPDATE_CAS_ID_CQL            = 'UPDATE project.users SET cas_id = ? WHERE username = ?'
// const UPDATE_LINKEDIN_IN_CQL       = 'UPDATE project.users SET linkedin_id = ? WHERE username = ?'
// const UPDATE_PASSWORD_CQL          = 'UPDATE project.users SET password = ? WHERE username = ?'

const UserCreationValidation = [
    check('email').isEmail().withMessage('must be a valid Email').trim() //.normalizeEmail()
        .custom(value => { return User.findOneByEmail(value).then((user) => {
            if (user) { throw new Error('must be a valid Email') }
            return true
        })}),
    check('username').matches(/^[a-z\d\-_]+$/i).withMessage('can only contain alphanumerics, -, and _')
        .isLength({min: 3}).withMessage('must be at least 3 characters long')
        .custom(value => { return User.findOneByUsername(value).then((user) => {
            if (user) { throw new Error('must be a unique username') }
            return true
        })}),
    // check('firstname', 'must be provided').exists(),
    // check('lastname', 'must be provided').exists(),
    check('password', 'must contain at least one lowercase, uppercase, number, and symbol')
        .matches(/[a-z]/).matches(/[A-Z]/).matches(/\d/).matches(/\W/)
        .isLength({min: 8}).withMessage('must be at least 8 characters long')
]

const UserUpdateValidation = [

]

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
            console.error(`[USER][Error] Failed to hash a password: ${error.message}`)
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

    // updatePassword(password) {

    // }

    // updateCASID(cas_id) {

    // }

    // updateLinkedinID(linkedin_id) {

    // }

    // updateProfile(props) {

    // }

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
                        reject(new Error('Internal Error'))
                    })
                } else {
                    console.error('[User][Error] Could not create User due to password error')
                    reject(new Error('Internal Error'))
                }
            })
        })
    }

}

module.exports = { User, UserCreationValidation, UserUpdateValidation }
