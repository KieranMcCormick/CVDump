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

describe('routes/index', () => {
    describe('GET index', () => {
        it('should load', (done) => {
            chai.request(server)
            .get('/')
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('text/html');
                done();
            });
        });
    })
})
