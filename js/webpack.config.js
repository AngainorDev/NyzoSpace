const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {main : ["./src/index.js"],
          convert: ["./src/convert.js"],
          paper: ["./src/paper.js"]} ,
  target: "web",
  plugins: [
    new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html",
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: "convert.html",
      template: "src/convert.html",
      chunks: ['convert']
    }),
    new HtmlWebpackPlugin({
      filename: "paper.html",
      template: "src/paper.html",
      chunks: ['paper']
    })
  ],
 module: {
      rules: [
       {
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           'file-loader',
         ],
       },
       {
         test: /\.css$/,
         use: ['style-loader', 'css-loader']
       }
      ],
    },

  mode: "development",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  }
};
