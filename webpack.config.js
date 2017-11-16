const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

module.exports = {
    entry: [
        path.resolve('src', 'index.js')
    ],

    output: {
        path: path.resolve('dist'),
        filename: 'bundle.[chunkhash].js'
    },

    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, loader: 'style-loader!css-loader', include: /normalize\.css/ },
            { test: /\.css$/, loader: 'style-loader!css-loader', exclude: /node_modules/ },
            // { test: /\.svg$/, loader: 'svg-url-loader', exclude: /node_modules/ },
            {
                test: /\.(?:png|jpg|svg)$/,
                loader: 'url-loader',
                query: {
                    // Inline images smaller than 64kb as data URIs
                    limit: 64000
                }
            },
            {
                test: /\.(woff|woff2|eot|svg|ttf)$/,
                exclude: /assets/,
                loader: 'file?name=/[name].[ext]'
            }
        ]
    },

    /* Note: the "devtool" setting influences bundle size *significantly*.
       https://webpack.js.org/configuration/devtool/ */
    devtool: 'source-map',

    devServer: {
        contentBase: './',
        hot: true,
        inline: false,
        port: 8080,
        // disableHostCheck: true
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            minimize: true,
            compress: {warnings: true}
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('src', 'index.html.template'),

            filename: 'index.html',
            inject: 'body'
        }),
        new WebpackBundleSizeAnalyzerPlugin(path.resolve('dist', 'bundle-size-report.txt'))
    ]

};