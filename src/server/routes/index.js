module.exports = (app) => {
    app.post(
        '/test',
        (req, res) => {
            res.send(req.body)
        }
    )
}
