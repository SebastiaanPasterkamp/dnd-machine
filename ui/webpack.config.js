const webpack = require('webpack');
const path = require('path');

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HotModuleReplacementPlugin = require('webpack-hot-middleware');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devMode = process.env.NODE_ENV !== 'production';

const PROJECT = 'dnd-machine';
const OUTPUT_PATH_JSX = path.resolve(__dirname, '..', 'app', 'static');
const SOURCE_PATH_JSX = path.resolve(__dirname, 'src', 'jsx');
const OUTPUT_PATH_SASS = 'css';
const SOURCE_PATH_SASS = path.resolve(__dirname, 'src', 'sass');
const OUTPUT_PATH_IMG = 'img';
const SOURCE_PATH_IMG = path.resolve(__dirname, 'src', 'img');

const config = {
    mode: process.env.NODE_ENV,
    entry: {
        [PROJECT]: SOURCE_PATH_JSX + '/index.jsx',
    },
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
                target: 'http://nginx:8080',
                secure: false,
            }
        }

    },
    output: {
        path: OUTPUT_PATH_JSX,
        publicPath: "/static/",
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        hotUpdateMainFilename: '__hmr/[hash].hot-update.json',
        hotUpdateChunkFilename: '__hmr/[id].[hash].hot-update.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.json'],
    },
    module : {
        rules : [
            {
                test: /\.jsx?$/,
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
                test: /\.(s[ac]ss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                            // only enable hot in development
                            hmr: process.env.NODE_ENV === 'development',
                            // if hmr does not work, this is a forceful method.
                            reloadAll: true,
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: `${OUTPUT_PATH_SASS}/[name].css`,
            chunkFilename: `${OUTPUT_PATH_SASS}/[name].css`,
        }),
        new ProgressBarPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                components: {
                    test: /[\\/]components[\\/](?!.*\.s?css$)/,
                    priority: -30,
                },
                views: {
                    test: /[\\/]views[\\/](?!.*\.s?css$)/,
                    priority: -30,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                [PROJECT]: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            }
        },
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({}),
        ],
    }
};

module.exports = config;
