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
    contentWorld: "./src/content.world.ts",
    background: "./src/background.ts",
    swaggerUI: "./src/shared/website/swagger/swagger-ui.tsx",
    swaggerTest: "./src/shared/website/swagger/swagger-test.tsx",
  },

  output: {
    path: path.join(__dirname, ".."), // Thư mục chứa file được build ra
    filename: ({ chunk: { name } }) => {
      switch (name) {
        case "swaggerUI":
          return "extension/src/shared/website/swagger/[name].bundle.js"
        case "swaggerTest":
          return "extension/src/shared/website/swagger/[name].bundle.js"
        default:
          return "extension-pack/build/[name].bundle.js"
      }
    }, // Tên file được build ra
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
      patterns: [
        {
          from: path.resolve(__dirname, "./src/shared"),
          to: path.resolve(__dirname, "../popup/src/shared"),
        },
        {
          from: path.resolve(__dirname, "./src/assets/images"),
          to: path.resolve(__dirname, "../extension-pack/assets/images/images"),
        },
        {
          from: path.resolve(__dirname, "./src/assets/js"),
          to: path.resolve(__dirname, "../extension-pack/assets/js"),
        },
        {
          from: path.resolve(__dirname, "./src/assets/css"),
          to: path.resolve(__dirname, "../extension-pack/assets/css"),
        },
      ],
    }),
  ],
}
