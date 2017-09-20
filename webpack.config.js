const webpack = require('webpack')
const postcss = require('postcss-cssnext')
const WebpackNotifierPlugin = require('webpack-notifier')

module.exports = env => ({
    entry: './index.js',
    output: {
        filename: './build/bundle.js',
        publicPath: '/',
        path: __dirname,
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['env', { modules: false, loose: true }], 'stage-0', 'react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1, modules: true },
                    },
                    {
                        loader: 'postcss-loader',
                        options: { plugins: [postcss()] },
                    },
                ],
            },
        ],
    },
    resolve: {
        alias: env.prod && {
            react: 'preact-compat',
            'react-dom': 'preact-compat',
        },
    },
    plugins: [
        new WebpackNotifierPlugin(),
        ...((env.prod && [
            new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
            new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
            new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, mangle: true }),
        ]) || []),
    ],
})