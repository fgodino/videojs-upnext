const path = require('path');

module.exports = {
  // mode: "development",
  entry: {
    upnext: './src/js/index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  externals: {
    'video.js': 'videojs'
  },
  optimization: {
    minimize: false
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '../dist/',
    filename: '[name].js'
  }
};
