const webpack = require('webpack')

const webpackDevConfig = {
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
            }
        ]
    },
    plugins: [
        // The DefinePlugin allows you to create global constants which can be configured at compile time.
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.BROWSER': JSON.stringify(true)
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}

module.exports = webpackDevConfig
