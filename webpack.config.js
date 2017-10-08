const path = require('path');
const webpack = require('webpack');

const settings = {
    entry: {
        bundle: [
            'react-hot-loader/patch',
            './src/frontend/index.js'
        ],
        js: ['babel-polyfill', './src/frontend/index.js'],
        vendor: ['react']
    },
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve('build')
    },
    resolve: {
        extensions: ['.js', '.json', '.css']
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', {modules: false}],
                        'stage-0',
                        'react'
                    ],
                    plugins: [
                        'transform-node-env-inline',
                        'transform-decorators-legacy'
                    ],
                    env: {
                        development: {
                            plugins: ['react-hot-loader/babel']
                        }
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: true,
                            importLoaders: 1,
                            localIdentName: '[name]--[local]--[hash:base64:8]'
                        }
                    },
                    'postcss-loader' // has separate config, see postcss.config.js nearby
                ]
            }
        ],
        loaders: [{test: /\.json$/, loader: 'json-loader'}]
    },
    devServer: {
        contentBase: path.resolve('src/www'),
        publicPath: 'http://localhost:8080/', // full URL is necessary for Hot Module Replacement if additional path will be added.
        quiet: false,
        hot: true,
        historyApiFallback: true,
        inline: true
    },
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};

module.exports = settings;
