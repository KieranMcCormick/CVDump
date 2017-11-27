process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testHelpers = require('../test_helpers')
const server = require('../../../src/server')

before(() => {
    return testHelpers.pristineDB().then()
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
            });
        });

        it('should 200 when logged in', (done) => {
            const agent = chai.request.agent(server)
            testHelpers.loginUser(agent).then(() => {
                agent.get('/api/currentUser')
                .end((err, res) => {
                    res.status.should.equal(200)
                    should.not.exist(err)
                    done()
                });
            })
        });
    })
})
