const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: "./src/index.js", // Dẫn tới file index.js ta đã tạo
    output: {
        path: path.join(__dirname, "./src/build"), // Thư mục chứa file được build ra
        filename: "bundle.js" // Tên file được build ra
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        esmodules: true,
                                    },
                                },
                            ],
                        ],
                    }
                }
            },
            {
                test: /\.css$/, // Sử dụng style-loader, css-loader cho file .css
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    // Chứa các plugins sẽ cài đặt trong tương lai
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/popup.html"
        })
    ]
};