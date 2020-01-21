const path = require('path');

module.exports = {
  // mode: "development",
  entry: {
    upnext: './src/js/index.js'
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
