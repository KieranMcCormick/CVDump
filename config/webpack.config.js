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
    },
    module: {
        rules: [
            {
                test: /\.(jsx?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: `${__dirname}/tmp`
                }
            },
            {
                test: /\.(s?css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader'
            }
        ]
    }
}

if (process.env.NODE_ENV === 'production') {
    webpackConfig = merge(webpackConfig, webpackProdConfig)
} else {
    webpackConfig = merge(webpackConfig, webpackDevConfig)
}

if (process.env.WEBPACK_ANALYZER) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

    webpackConfig = merge(webpackConfig, {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerPort: 18888,
                openAnalyzer: false,
            })
        ],
    })
}

module.exports = webpackConfig
