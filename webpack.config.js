const LiveReloadPlugin = require('webpack-livereload-plugin');
const LiveReloadPluginConfig = new LiveReloadPlugin()
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: [
    './client/index.js'
  ],
  output: {
    path: __dirname + '/server/views',
    filename: "index_bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /server/],
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/, /server/],
        loader: "style-loader!css-loader"
      }
    ]
  },
  plugins: [LiveReloadPluginConfig, new UglifyJSPlugin({
    parallel: {
      cache: true,
      workers: 4
    }
  })]
}
