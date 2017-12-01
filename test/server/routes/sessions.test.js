process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testHelpers = require('../test_helpers')
const server = require('../../../src/server')

before(() => {
    return testHelpers.pristineDB()
})

describe('routes/sessions', () => {
    describe('GET currentUser', () => {
        it('should 403 when not logged in', (done) => {
            chai.request(server)
            .get('/api/currentUser')
            .end((err, res) => {
                res.status.should.equal(403)
                res.text.should.equal('Forbidden')
                res.type.should.equal('text/plain')
                should.exist(err)
                done()
            })
        })

        it('should 200 when logged in', (done) => {
            const agent = chai.request.agent(server)
            testHelpers.loginUser(agent).then(() => {
                agent.get('/api/currentUser')
                .end((err, res) => {
                    res.status.should.equal(200)
                    should.not.exist(err)
                    done()
                })
            })
        })

        it('should include login method - PW', (done) => {
            const agent = chai.request.agent(server)
            testHelpers.loginUser(agent).then(() => {
                agent.get('/api/currentUser')
                .end((err, res) => {
                    res.status.should.equal(200)
                    should.not.exist(err)
                    done()
                })
            })
        })
    })

    describe('GET login', () => {
        it('should fall through to React frontend', (done) => {
            chai.request(server)
            .get('/login')
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('text/html');
                res.text.should.contain('<script src="/main.js"></script>')
                done();
            });
        })
    })

    describe('POST login', () => {
        it('should 200 with JSON when successful', (done) => {
            done()
        })

        it('should 401 with JSON when invalid credentials', (done) => {
            done()
        })

        it('should include login method - PW', (done) => {
            done()
        })
    })

    describe('GET logout', () => {
        it('should fall through to React frontend', (done) => {
            chai.request(server)
            .get('/login')
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('text/html');
                res.text.should.contain('<script src="/main.js"></script>')
                done();
            });
        })
    })

    describe('POST logout', () => {

    })

    describe('DELETE logout', () => {
        it('should fall through to React frontend', (done) => {
            chai.request(server)
            .get('/login')
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('text/html');
                res.text.should.contain('<script src="/main.js"></script>')
                done();
            });
        })
    })

    describe('GET signup', () => {

    })

    describe('POST signup', () => {

    })
})
