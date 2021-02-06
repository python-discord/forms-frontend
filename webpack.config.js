const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require("webpack")
if (process.env.NODE_ENV === "development") { require("dotenv").config(); }

module.exports = {
    entry: "./src/index.tsx",
    mode: process.env.NODE_ENV || "production",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js",
        sourceMapFilename: "[name].bundle.js.map",
        publicPath: "/",
        devtoolModuleFilenameTemplate: "[resource-path]"
    },
    devtool: "source-map",
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
            to: '.',
            globOptions: {
                ignore: [
                    '**/index.html'
                ]
            }
        }, ],
    }), new webpack.EnvironmentPlugin({
        NODE_ENV: "production",
        BRANCH: "development",
        COMMIT_REF: "development",
        REACT_APP_SENTRY_DSN: "https://false@notreal.ingest.sentry.io/1234",
        REACT_APP_OAUTH2_CLIENT_ID: "0",
        BACKEND_URL: "https://forms-api.pythondiscord.com/",
        CONTEXT: "development"
    }), new HtmlWebpackPlugin({
        inject: true,
        template: 'public/index.html'
    })]
}
