var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var HotModuleReplacementPlugin = require('webpack-hot-middleware');

var PROJECT = 'dnd-machine';
var OUTPUT_PATH_JSX = path.resolve(__dirname, '..', 'app', 'static');
var SOURCE_PATH_JSX = path.resolve(__dirname, 'src', 'jsx');
var OUTPUT_PATH_SASS = 'css';
var SOURCE_PATH_SASS = path.resolve(__dirname, 'src', 'sass');
var OUTPUT_PATH_IMG = '../img/';
var SOURCE_PATH_IMG = path.resolve(__dirname, 'src', 'img');

var config = {
    entry: SOURCE_PATH_JSX + '/index.jsx',
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        disableHostCheck: true,
        compress: true,
        contentBase: "../app/static/",
        publicPath: "/static/",
        open: false,
        overlay: true,
        hot: true,
        hotOnly: true,
        inline: true,
        proxy: {
            '/': {
                target: 'http://api.in.uprintf.com/',
                secure: false
                // changeOrigin: true
            }
        }

    },
    output: {
        path: OUTPUT_PATH_JSX,
        filename: `js/${PROJECT}.js`,
        hotUpdateMainFilename: '__hmr/[hash].hot-update.json',
        hotUpdateChunkFilename: '__hmr/[id].[hash].hot-update.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.json'],
    },
    module : {
        loaders : [
            {
                test: /\.jsx?/,
                include: SOURCE_PATH_JSX,
                loader: 'babel-loader',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: OUTPUT_PATH_IMG,
                }
            },
            {
                test: /\.json$/i,
                include : SOURCE_PATH_JSX,
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
                                SOURCE_PATH_SASS,
                            ],
                        },
                    }
                ]),
            }
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: `${OUTPUT_PATH_SASS}/${PROJECT}.css`,
            allChunks: true
        }),
        new ProgressBarPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
};

module.exports = config;
