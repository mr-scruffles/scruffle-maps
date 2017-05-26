/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PATHDIR = require('./paths');

module.exports = {
  devtool: 'cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      favicon: path.resolve(PATHDIR.SRC, 'public', 'favicon.ico'),
      template: path.resolve(PATHDIR.SRC, 'public', 'index.html'),
      title: 'Scruffle Map',
      appMountId: 'app',
      filename: 'index.html',
      chunks: ['app'],
      minify: {
        html5: true,
        collapseWhitespace: true,
      },
    }),
  ],
};
