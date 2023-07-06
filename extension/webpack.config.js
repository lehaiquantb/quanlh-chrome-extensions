const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

/** @type {import('webpack').Configuration} */
module.exports = {
  devtool: "cheap-module-source-map",
  entry: {
    popup: "./src/popup.ts",
    content: "./src/content.ts",
    background: "./src/background.ts",
  },
  output: {
    path: path.join(__dirname, "../extension-pack/build"), // Thư mục chứa file được build ra
    filename: "[name].bundle.js", // Tên file được build ra
    publicPath: "",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader", // Sử dụng ts-loader để biên dịch TypeScript và TSX
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    esmodules: true,
                  },
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/, // Sử dụng style-loader, css-loader cho file .css
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    plugins: [
      new TsconfigPathsPlugin({
        /* options: see below */
      }),
    ],
  },
  // Chứa các plugins sẽ cài đặt trong tương lai
  plugins: [
    new HtmlWebpackPlugin({
      template: "../extension-pack/popup.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "./src/shared", to: "../../popup/src/shared" }],
    }),
  ],
}
