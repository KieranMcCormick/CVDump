const util = require('util')
const exec = util.promisify(require('child_process').exec)
const chai = require('chai')
const should = chai.should()
const Cookie = require('cookiejar')

const dbSecrets = require('../../src/server/db/secrets.json')['test']

const pristineDB = async () => {
    try {
        await exec(`mysql -h 127.0.0.1 -u ${dbSecrets['user']} -p${dbSecrets['password']} ${dbSecrets['database']} < ./chef/cookbooks/database/files/sqldump.sql`)
    } catch (e) {
        throw new Error('[TestHelper] Could not Pristine DB! Check Test DB config.')
    }
}
const loginUser = (agent, username = 'user1', password = 'Pass123$') => {
    return agent.get('/login').then((res) => {
        const csrf = extractCSRF(agent)
        return agent.post('/api/login')
            .send({ username, password })
            .set('X-CSRF-TOKEN', csrf)
            .then((res) => {
                res.should.have.cookie('express:sess')
                return
            })
    })
}

const extractCSRF = (agent) => {
    const cookie = agent.jar.getCookie('_csrfToken', new Cookie.CookieAccessInfo())
    return cookie ? cookie.value : null
}

const extractCookies = (agent) => {
    return agent.jar.getCookies(new Cookie.CookieAccessInfo())
}

module.exports = {
    pristineDB,
    loginUser,
    extractCSRF,
    extractCookies
}
