'use strict';

const webpack = require('webpack');

module.exports = {
  entry: './examples/full-page/full-page.jsx',
  output: {
    path: './examples/full-page/build',
    filename: 'fullpage.bundle.js',
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
