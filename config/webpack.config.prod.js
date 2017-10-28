const webpack = require('webpack')

const webpackProdConfig = {
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
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.BROWSER': JSON.stringify(true)
        }),
        new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ]
}

module.exports = webpackProdConfig
