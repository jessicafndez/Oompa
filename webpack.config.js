var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  context: path.resolve(__dirname, 'src'),  
  entry: {
    // removing 'src' directory from entry point, since 'context' is taking care of that
    app: '../app/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './app.bundle.js'
  },
  module: {
    rules:[
      {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }, {
              loader: 'postcss-loader'
            }],
            fallback: 'style-loader'
          })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },  {
            loader: 'less-loader'
          }],
          fallback: 'style-loader'
        })
      }
  ]
  },
  plugins: [
    new ExtractTextPlugin({filename:'app.bundle.css'}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],   
      Handlebars: 'handlebars'       
    })
  ],
  node: {
    fs: "empty"
 },
  watch: true
}

module.exports = config;