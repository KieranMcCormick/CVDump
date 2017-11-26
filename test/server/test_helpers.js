const util = require('util')
const exec = util.promisify(require('child_process').exec)

const dbSecrets = require('../../src/server/db/secrets.json')['test']

module.exports = {
    pristineDB: async () => {
        try {
            await exec(`mysql -u ${dbSecrets['user']} -p${dbSecrets['password']} ${dbSecrets['database']} < ./chef/cookbooks/database/files/sqldump.sql`)
        } catch (e) {
            throw new Error('[TestHelper] Could not Pristine DB! Check Test DB config.')
        }
    }
}
