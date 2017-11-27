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

describe('routes/users', () => {
    describe('GET currentUser', () => {
        it('should 403 when not logged in', (done) => {
            chai.request(server)
            .get('/currentUser')
            .end((err, res) => {
                should.exist(err);
                res.status.should.equal(403);
                res.text.should.equal('Forbidden');
                res.type.should.equal('text/plain')
                done();
            });
        });
    })
})
