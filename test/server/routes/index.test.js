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
    it('GET should load', (done) => {
        chai.request(server)
        .get('/')
        .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<script src="/main.js"></script>')
            done();
        });
    });

    it('GET on /login should load', (done) => {
        chai.request(server)
        .get('/login')
        .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<script src="/main.js"></script>')
            done();
        });
    });

    it('GET on /files should load', (done) => {
        chai.request(server)
        .get('/files')
        .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<script src="/main.js"></script>')
            done();
        });
    });

    it('GET on invalid path should load', (done) => {
        chai.request(server)
        .get('/foobar')
        .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<script src="/main.js"></script>')
            done();
        });
    });
})
