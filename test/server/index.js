process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const server = require('../../src/server')

describe('GET index', () => {
    it('should respond with all users', (done) => {
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
