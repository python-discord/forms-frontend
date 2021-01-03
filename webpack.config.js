const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require("webpack")
if (process.env.NODE_ENV === "development") { require("dotenv").config(); }

module.exports = {
    entry: "./src/index.tsx",
    mode: process.env.NODE_ENV,
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].[contenthash].bundle.js",
        publicPath: "/",
        devtoolModuleFilenameTemplate: "file:///" + path.resolve(__dirname, "[resource-path]?[loaders]")
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxSize: 204800,
        }
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: "swc-loader",
                options: {
                    jsc: {
                        parser: {
                            syntax: "ecmascript",
                            jsx: true,
                            dynamicImport: true
                        },
                        transform: {
                            react: {
                                pragma: "React.createElement",
                                pragmaFrag: "React.Fragment",
                                throwIfNamespace: true,
                                development: false,
                                useBuiltins: false
                            }
                        }
                    }
                }
            }
        }, {
            test: /\.tsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: "swc-loader",
                options: {
                    jsc: {
                        parser: {
                            syntax: "typescript",
                            tsx: true,
                            dynamicImport: true
                        }
                    }
                }
            }
        }, {
            test: /\.svg$/,
            loader: '@svgr/webpack'
        }, {
            test: /\.css$/,
            loader: 'raw-loader',
            options: {
                esModule: false
            }
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
    },
    plugins: [
    new CopyPlugin({
        patterns: [{
            from: 'public',
            to: '.'
        }, ],
    }), new webpack.EnvironmentPlugin({
        NODE_ENV: "production",
        REACT_APP_SHA: "development",
        REACT_APP_SENTRY_DSN: "https://false@notreal.ingest.sentry.io/1234",
        REACT_APP_BRANCH: "development",
        REACT_APP_OAUTH2_CLIENT_ID: "0",
        BACKEND_URL: "https://forms-api.pythondiscord.com/",
        CONTEXT: "development"
    }), new HtmlWebpackPlugin({
        inject: true,
        template: 'public/index.html'
    })]
}
