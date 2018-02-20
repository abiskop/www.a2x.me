const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FontminPlugin = require('fontmin-webpack')
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

const config = require(path.resolve('assets', 'config.json'));

const cssLoader = ({ include, exclude }) => ({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    minimize: false
                }
            }
        ]
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
                test: /\.(?:png|jpg)$/,
                exclude: /favicon\.png$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        /* Inline images smaller than x bytes as data URIs */
                        limit: 64000,
                        /* Fall back to file-loader, appending hash to file name */
                        fallback: 'file-loader',
                        name: '[name].[hash].[ext]'
                    }
                }
            },
            {
                test: /\.(woff|woff2)$/,
                /* For fonts, only woff/woff2 is needed in modern browsers. We want to inline those, but not the legacy ones. */
                loader: 'url-loader',
                options: {
                    /* Inline files smaller than x bytes as data URIs */
                    limit: 64000,
                    /* Fall back to file-loader, appending hash to file name */
                    fallback: 'file-loader',
                    name: '[name].[hash].[ext]'
                }
            },
            {
                /* For fonts, only woff/woff2 is needed in modern browsers. We want to inline those, but not the legacy ones. */
                test: /\.(eot|svg|ttf)$/,
                loader: 'url-loader',
                options: {
                    /* Inline files smaller than x bytes as data URIs */
                    limit: 1024,
                    /* Fall back to file-loader, appending hash to file name */
                    fallback: 'file-loader',
                    name: '[name].[hash].[ext]'
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    filename: 'index.html'
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
        new UglifyJsPlugin({
            sourceMap: true
        }),
        new ExtractTextPlugin("styles.[hash].css"),
        new PurifyCSSPlugin({
            /* Paths to parse for rules. These should be absolute! */
            paths: [
                path.join(__dirname, 'src/index.html.ejs'),
                path.join(__dirname, 'assets/config.json')
            ],
            purifyOptions: {
                rejected: true,
                minify: true
            }
        }),
        new FontminPlugin({
            autodetect: true, // automatically pull unicode characters from CSS
            // glyphs: ['\uf0c8', /* extra glyphs to include */]
        }),
        new HtmlWebpackPlugin({
            ...config.props,
            template: path.resolve('src', 'index.html.ejs'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            inlineSource: '.(css|js)$',
            inject: 'body'
        }),
        new HtmlWebpackInlineSourcePlugin(),

        new WebpackBundleSizeAnalyzerPlugin(path.resolve('dist', 'bundle-size-report.txt'))
    ]
};