const webpack = require('webpack');
const path = require('path');

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
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
const OUTPUT_PATH_FONT = 'fonts';

const config = {
    mode: process.env.NODE_ENV,
    devtool: 'inline-source-map',
    watchOptions: {
        ignored: /node_modules/,
    },
    entry: {
        [PROJECT]: SOURCE_PATH_JSX + '/index.jsx',
        polyfills: SOURCE_PATH_JSX + '/polyfills.jsx',
    },
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        disableHostCheck: true,
        compress: true,
        contentBase: OUTPUT_PATH_JSX,
        publicPath: "/static/",
        open: false,
        overlay: true,
        hot: true,
        hotOnly: true,
        inline: true,
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
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: /fonts/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: OUTPUT_PATH_IMG,
                }
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/i,
                exclude: /img/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: OUTPUT_PATH_FONT,
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
                            hmr: devMode,
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
                    reuseExistingChunk: true,
                },
                views: {
                    test: /[\\/]views[\\/](?!.*\.s?css$)/,
                    priority: -30,
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const { context } = module;
                        const packageName = context.match(/[\\/]node_modules[\\/](.*?)(?:[\\/]|$)/)[1];
                        return `npm.${packageName.replace('@', '')}`;
                    },
                    priority: -10,
                    reuseExistingChunk: true,
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
