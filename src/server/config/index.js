module.exports = {
    server: {
        fqdn: process.env.FQDN ? `https://${process.env.FQDN}` : 'http://localhost:8080',
    },
}
