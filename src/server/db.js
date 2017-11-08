const cassandra = require('cassandra-driver')
const distance = cassandra.types.distance

let cqlConnection = function() {
    const options = {
        contactPoints: ['localhost'],
        keyspace: 'project'
    }
    const client = new cassandra.Client(options)
    return client
}


module.exports = {

    cqlInsert: function(sql, params, callback) {

        client = cqlConnection()
        //TODO
        santized = params
        client.execute(sql, santized, { prepare: true }).then(function(result){
            client.shutdown()
            callback(null, result)
        })
        .catch(function(err){ 
            client.shutdown()
            callback(err, null)
        })
    },

    cqlSelect: function(sql, params, callback) {

        const client = cqlConnection()
        //TODO
        santized = params
        client.execute(sql, santized, { prepare: true }).then(function(result){
            //example of how to debug: console.log("Query result: %s", result.rows[0].email_address)
            client.shutdown()
            callback(null, result.rows)
        })
        .catch(function(err){
            client.shutdown()
            callback(err, null)
        })
    }

}