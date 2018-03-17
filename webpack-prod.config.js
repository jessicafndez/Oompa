var path = require('path');
var webpack = require('webpack');


module.exports = {
    entry: "./app/app.js",
    output: {
      filename: "bundle.js",
      path: __dirname
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    externals: {
        jquery: 'jQuery'
    },
}