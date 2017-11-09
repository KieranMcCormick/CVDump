const db = require('../db.js')

module.exports = (app) => {
    app.post(
        '/test',
        (req, res) => {
            res.send(req.body)
        }
    )

    if (process.env.NODE_ENV === 'development'){
        app.post(
            '/select',
            (req, res) => {
                db.cqlSelect('select * from users;', [], function(err, result){
                    if (err){
                        res.send(err)
                    }
                    else{
                        res.send(result)
                    }
                })
            }

        )

        app.post(
            '/insert',
            (req, res) => {
                let query = 'INSERT INTO users (username, firstname, lastname, email_address, password)' +
                        'VALUES (?, ?, ?, ?, ?);'
                let params = ['tommy', 'Tom', 'Abbot', 'tom@email.com', 'password']

                db.cqlSelect(query, params, function(err, result){
                    if (err){
                        res.send(err)
                    }
                    else{
                        res.send(result)
                    }
                })
            }

        )
    }
}
