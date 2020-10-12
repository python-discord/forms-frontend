const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack")

module.exports = (env) => {
  return {
    entry: "./src/index.tsx",
    mode: env,
    output: {
      path: path.resolve(__dirname, "../build/js"),
      filename: "[name].bundle.js",
      publicPath: "/",
      devtoolModuleFilenameTemplate: "file:///" + path.resolve(__dirname, "[resource-path]?[loaders]")
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
      rules: [
        {
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
        },
        {
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
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        }
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      compress: true,
      port: 3000,
      historyApiFallback: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: 'public/index.html'
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: "production",
        REACT_APP_SHA: "development",
        REACT_APP_SENTRY_DSN: "development",
        REACT_APP_BRANCH: "development",
        REACT_APP_OAUTH2_CLIENT_ID: "0"
      })
    ]
  }
}
