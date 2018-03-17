var webpack = require('webpack');
var path = require('path');

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
  plugins: [
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