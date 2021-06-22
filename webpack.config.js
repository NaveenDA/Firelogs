const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV !== "production" ? "development" : "production",
  entry: {
    "dev-extension/dist/firelogs-icon": path.resolve(
      path.join(__dirname, "./src/firelogs-icon/index.js")
    ),
    "dev-extension/dist/firelogs-tabs": path.resolve(
      __dirname,
      "./src/firelogs-tabs/index.js"
    ),
    "dev-extension/dist/background": path.resolve(
      __dirname,
      "./src/core/index.js"
    ),
    "dev-extension/dist/content": path.resolve(
      __dirname,
      "./src/response/index.js"
    )
  },
  output: {
    path: path.resolve(__dirname),
    filename: "[name].js"
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "url-loader",
        options: {
          limit: true
        }
      }
    ]
  }
};
