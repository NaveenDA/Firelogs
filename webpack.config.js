const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV !== "production" ? "development" : "production",

  entry: {
    "dist/firelogs": path.resolve(__dirname, "/src/firelogs/index.js"),
    "dist/firelogs-tabs": path.resolve(__dirname, "/src/tabs/index.js"),
    "dist/background": path.resolve(__dirname, "/src/extension/index.js"),
  },
  output: {
    path: path.resolve(__dirname),
    filename: "[name].js"
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
      },
      { test: /\.hbs$/, loader: "handlebars-loader" }

    ]
  }
};
