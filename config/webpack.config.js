const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackDevConfig = require('./webpack.config.dev')
const webpackProdConfig = require('./webpack.config.prod')

let webpackConfig = {
    entry: __dirname + '/../src/app/js/app.jsx',
    output: {
        filename: '[name].js',
        path: __dirname + '/../src/public'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
}

if (process.env.NODE_ENV === 'production') {
    webpackConfig = merge(webpackConfig, webpackProdConfig)
} else {
    webpackConfig = merge(webpackConfig, webpackDevConfig)
}

module.exports = webpackConfig
