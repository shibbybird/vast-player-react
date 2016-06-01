'use strict';

const webpack = require('webpack');

module.exports = {
  entry: './examples/multi-ad/multi-ad.jsx',
  output: {
    path: './examples/multi-ad/build',
    filename: 'multiad.bundle.js',
  },
  externals: {
    request: 'serverRequest',
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
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
};
