var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

var PROJECT = 'dnd-machine';
var BUILD_DIR_JSX = path.resolve(__dirname, '..', 'app', 'static', 'js');
var APP_DIR_JSX = path.resolve(__dirname, 'src', 'jsx');
var BUILD_DIR_SASS = 'app/static/css';
var APP_DIR_SASS = path.resolve(__dirname, 'src', 'sass');
var BUILD_DIR_IMG = '../img/';
var APP_DIR_IMG = path.resolve(__dirname, 'src', 'img');

var config = {
    entry: APP_DIR_JSX + '/index.jsx',
    output: {
        path: BUILD_DIR_JSX,
        filename: PROJECT + '.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.json'],
    },
    module : {
        loaders : [
            {
                test: /\.jsx?/,
                include: APP_DIR_JSX,
                loader: 'babel-loader',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: BUILD_DIR_IMG,
                }
            },
            {
                test: /\.json$/i,
                include : APP_DIR_JSX,
                loader : 'json-loader'
            },
            {
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract([
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: require.resolve('sass-loader'),
                        options: {
                            sourceMap: true,
                            includePaths: [
                                APP_DIR_SASS,
                            ],
                        },
                    }
                ]),
            }
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '../css/' + PROJECT + '.css',
            allChunks: true
        }),
        new ProgressBarPlugin()
    ]
};

module.exports = config;
