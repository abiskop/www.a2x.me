const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

const config = require(path.resolve('src', 'config.json'));

const cssLoader = ({ include, exclude }) => ({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: {
            loader: 'css-loader',
            options: { minimize: true }
        }
    }),
    include,
    exclude
});

const babelLoader = () => ({
    /* Transpile .js files using babel. */
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: [
                ['env', {
                    "debug": true,
                    "targets": {
                        "browsers": ["> 1%", "not ie <= 10"]
                    },
                    "useBuiltIns": "usage"
                }]
            ],
            plugins: ['babel-plugin-transform-runtime']
        }
    },
    exclude: /node_modules/
});

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
            babelLoader(),
            {
                test: /\.ejs$/,
                loader: 'ejs-loader'
            },
            cssLoader({ include: /(normalize\.css|foundation-icons\.css)/ }),
            cssLoader({ exclude: /node_modules/ }),
            {
                test: /favicon\.png$/,
                loader: 'file-loader?name=/[name].[ext]'
            },
            {
                test: /\.(?:png|jpg|svg)$/,
                exclude: /favicon\.png$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        /* Inline images smaller than 16kb as data URIs */
                        limit: 16000,
                        /* Fall back to file-loader, appending hash to file name */
                        fallback: 'file-loader',
                        name: '[name].[hash].[ext]'
                    }
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    filename: 'index.html'
                }
            },
            {
                test: /\.(woff|woff2|eot|svg|ttf)$/,
                loader: 'url-loader',
                options: {
                    /* Inline files smaller than 16kb as data URIs */
                    limit: 16000,
                    /* Fall back to file-loader, appending hash to file name */
                    fallback: 'file-loader',
                    name: '[name].[hash].[ext]'
                }
            }
        ]
    },

    devtool: 'source-map',

    devServer: {
        contentBase: './',
        hot: true,
        inline: false,
        port: 8080,
        /* Disable host check for local development if needed - sharp edges!
           https://webpack.js.org/configuration/dev-server/#devserver-disablehostcheck */
        // disableHostCheck: true
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new WebpackMd5Hash(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            minimize: true,
            compress: {warnings: true}
        }),
        new ExtractTextPlugin("styles.[hash].css"),
        new HtmlWebpackPlugin({
            ...config.props,
            template: path.resolve('src', 'index.html.ejs'),
            filename: 'index.html',
            inject: 'body'
        }),
        /* https://github.com/jantimon/resource-hints-webpack-plugin */
        new ResourceHintWebpackPlugin(),

        new WebpackBundleSizeAnalyzerPlugin(path.resolve('dist', 'bundle-size-report.txt'))
    ]
};