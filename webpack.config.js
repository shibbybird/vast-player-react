'use strict';

const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: './build',
    filename: 'app.bundle.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        },
      }],
  },
};
