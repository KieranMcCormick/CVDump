const mysql      = require('mysql')
const parsedJSON = require('./secrets.json')
const sqlstring  = require('sqlstring')

const options = {
    connectionLimit : 50,
    host            : 'localhost',
    user            : parsedJSON.user,
    password        : parsedJSON.password,
    database        : parsedJSON.database,
}

const pool = mysql.createPool(options)

module.exports = {

    sqlInsert: function(sql, params, callback) {

        const sanitized = sqlstring.format(sql, params)
        pool.getConnection(function(err, connection){

            if (err){
                callback(err, null)
            }

            connection.query(sanitized, function(error, results){
                connection.release()
                callback(null, results)

                if (error) {
                    callback(err, null)
                }
            })

        })
    },

    sqlUpdate: function(sql, params, callback) {

        const sanitized = sqlstring.format(sql, params)
        pool.getConnection(function(err, connection){

            if (err){
                callback(err, null)
            }

            connection.query(sanitized, function(error, results){
                connection.release()
                callback(null, results)

                if (error) {
                    callback(err, null)
                }
            })

        })
    },

    sqlDelete: function(sql, params, callback) {

        const sanitized = sqlstring.format(sql, params)
        pool.getConnection(function(err, connection){

            if (err){
                callback(err, null)
            }

            connection.query(sanitized, function(error, results){
                connection.release()
                callback(null, results)

                if (error) {
                    callback(err, null)
                }
            })
        })
    },

    sqlSelect: function(sql, params, callback) {

        const sanitized = sqlstring.format(sql, params)

        pool.getConnection(function(err, connection){

            if (err){
                callback(err, null)
            }

            connection.query(sanitized, function(error, results){
                connection.release()

                callback(null, results)

                if (error) {
                    callback(err, null)
                }
            })

        })
    },

    //WIP: PAGING
    // sqlPage: function(sql, params, offset=0, limit=5, callback) {

    //     const sanitized = sqlstring.format(sql, params)
    //     pool.getConnection(function(err, connection){

    //         connection.query(sanitized, function(error, results, fields){
    //             connection.release()
    //             callback(null, results)

    //             if (error) {
    //                 callback(err, null)
    //             }
    //         })
    //     })
    // },

}
